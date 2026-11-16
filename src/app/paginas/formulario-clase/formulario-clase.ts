// <app-formulario-clase> — Práctica 21 · la página /clases/nueva: el formulario reactivo de una
// clase nueva. Todavía NO manda nada a la API: al guardar sólo muestra el objeto que mandaría.
import { JsonPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { urlImagen } from '../../config';
import { CATEGORIAS, type Categoria, type ClaseNueva } from '../../modelos/clase';
import { bloquesDe5 } from '../../validadores';

@Component({
  imports: [ReactiveFormsModule, RouterLink, JsonPipe],
  selector: 'app-formulario-clase',
  styleUrl: './formulario-clase.css',
  templateUrl: './formulario-clase.html',
})
export class FormularioClase {
  private readonly fb = inject(FormBuilder);
  protected readonly categorias = CATEGORIAS;
  protected readonly urlImagen = urlImagen;

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

  // Lo que se mandaría a POST /clases. En la Práctica 22 se envía de verdad.
  protected readonly porEnviar = signal<ClaseNueva | null>(null);

  protected guardar() {
    if (this.formulario.invalid) {
      // Se marcan todos como tocados: así aparecen todos los mensajes de una vez.
      this.formulario.markAllAsTouched();
      this.porEnviar.set(null);
      return;
    }
    const { categoria, ...resto } = this.formulario.getRawValue();
    this.porEnviar.set({ ...resto, categoria: categoria as Categoria });
  }
}
