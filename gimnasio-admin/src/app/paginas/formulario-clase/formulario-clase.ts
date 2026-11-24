// <app-formulario-clase> — el formulario reactivo de una clase. Sirve para DOS rutas:
// /clases/nueva (crear) y /clases/:id/editar (editar).
// Práctica 21: validaciones y validador propio. Práctica 22: guarda en la API (POST o PATCH),
// elimina, y avisa antes de salir con cambios sin guardar.
import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, input, signal, type OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Catalogo } from '../../catalogo';
import { urlImagen } from '../../config';
import type { ConCambiosSinGuardar } from '../../guardias/cambios-sin-guardar.guard';
import { CATEGORIAS, type Categoria } from '../../modelos/clase';
import { ClasesApi } from '../../servicios/clases-api';
import { mensajeDeError } from '../../servicios/errores';
import { bloquesDe5 } from '../../validadores';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-formulario-clase',
  styleUrl: './formulario-clase.css',
  templateUrl: './formulario-clase.html',
})
export class FormularioClase implements OnInit, ConCambiosSinGuardar {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ClasesApi);
  private readonly catalogo = inject(Catalogo);
  private readonly router = inject(Router);
  protected readonly categorias = CATEGORIAS;
  protected readonly urlImagen = urlImagen;

  // Práctica 22: el :id de /clases/:id/editar llega como input, gracias a
  // withComponentInputBinding() en app.config.ts. En /clases/nueva no hay :id y vale undefined:
  // así sabe el formulario si está creando o editando.
  readonly id = input<string>();
  protected readonly esEdicion = computed(() => this.id() !== undefined);
  private readonly idNumero = computed(() => Number(this.id()));

  // El formulario: cada campo con su valor inicial y sus validadores. El valor vive AQUÍ, en el
  // FormControl, no en el template ni en un useState. nonNullable: al limpiar regresa al inicial.
  protected readonly formulario = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.maxLength(80)]],
    categoria: this.fb.nonNullable.control<Categoria | ''>('', Validators.required),
    descripcion: ['', [Validators.required, Validators.maxLength(255)]],
    duracionMin: [60, [Validators.required, Validators.min(10), bloquesDe5]],
    imagen: [
      '/img/clase-01.jpg',
      [Validators.required, Validators.maxLength(120), Validators.pattern(/^\/img\/[\w-]+\.(jpg|jpeg|png|webp)$/)],
    ],
  });

  // Atajo para el template: formulario.controls.nombre → c.nombre.
  protected readonly c = this.formulario.controls;

  // Mientras sale una petición los botones se deshabilitan; si la API la rechaza, aquí quedan
  // sus mensajes.
  protected readonly cargandoClase = signal(false);
  protected readonly guardando = signal(false);
  protected readonly eliminando = signal(false);
  protected readonly erroresDelServidor = signal<string[]>([]);
  protected readonly nombreOriginal = signal('');

  ngOnInit() {
    if (!this.esEdicion()) return;
    // Al editar, se pide la clase y se llena el formulario con patchValue: copia los campos que
    // se llaman igual (nombre, categoria…) e ignora los que el formulario no tiene (id, horarios).
    this.cargandoClase.set(true);
    this.api.obtener(this.idNumero()).subscribe({
      next: (clase) => {
        this.formulario.patchValue(clase);
        this.formulario.markAsPristine(); // lo que vino de la API no es un «cambio sin guardar»
        this.nombreOriginal.set(clase.nombre);
        this.cargandoClase.set(false);
      },
      error: (e: unknown) => {
        this.cargandoClase.set(false);
        this.erroresDelServidor.set(mensajesDelServidor(e));
      },
    });
  }

  protected guardar() {
    if (this.formulario.invalid) {
      // Se marcan todos como tocados: así aparecen todos los mensajes de una vez.
      this.formulario.markAllAsTouched();
      return;
    }
    const { categoria, ...resto } = this.formulario.getRawValue();
    const datos = { ...resto, categoria: categoria as Categoria };
    this.guardando.set(true);
    this.erroresDelServidor.set([]);

    // La MISMA función para las dos rutas: con id es PATCH (editar); sin id, POST (crear).
    const peticion = this.esEdicion() ? this.api.actualizar(this.idNumero(), datos) : this.api.crear(datos);
    // HttpClient regresa un Observable «frío»: la petición sólo sale cuando alguien hace subscribe().
    peticion.subscribe({
      next: () => this.volverAlCatalogo(),
      error: (e: unknown) => {
        this.guardando.set(false);
        this.erroresDelServidor.set(mensajesDelServidor(e));
      },
    });
  }

  protected eliminar() {
    const seguro = confirm(
      `¿Eliminar la clase «${this.nombreOriginal()}»? También se borran sus horarios e inscripciones, y no se puede deshacer.`,
    );
    if (!seguro) return;
    this.eliminando.set(true);
    this.erroresDelServidor.set([]);
    this.api.eliminar(this.idNumero()).subscribe({
      next: () => this.volverAlCatalogo(),
      error: (e: unknown) => {
        this.eliminando.set(false);
        this.erroresDelServidor.set(mensajesDelServidor(e));
      },
    });
  }

  /** Para la guarda canDeactivate: sin cambios se sale directo; con cambios, se pregunta. */
  puedeSalir(): boolean {
    return !this.formulario.dirty || confirm('Hay cambios sin guardar. ¿Salir de todos modos?');
  }

  private volverAlCatalogo() {
    this.formulario.markAsPristine(); // ya no hay nada pendiente: la guarda de salida no pregunta
    this.catalogo.restaurar(); // vuelve a pedir GET /clases para que el catálogo esté al día
    this.router.navigate(['/clases']);
  }
}

// Un 400 trae un arreglo con un mensaje por cada regla que no se cumplió; los demás errores, uno.
function mensajesDelServidor(e: unknown): string[] {
  if (e instanceof HttpErrorResponse) {
    if (Array.isArray(e.error?.message)) return e.error.message;
    if (e.status === 401) return ['La API respondió 401: hay que entrar como administrador.'];
  }
  return [mensajeDeError(e, 'No se pudo completar la operación.')];
}
