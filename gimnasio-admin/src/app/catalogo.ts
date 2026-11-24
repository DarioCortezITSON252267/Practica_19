// Catalogo — el servicio con el estado del tablero, hecho con signals. Lo genera el CLI:
// npx ng generate service catalogo
// @Service() lo deja disponible en toda la aplicación: hay UNA sola instancia, y cada
// componente que hace inject(Catalogo) recibe esa misma.
import { httpResource } from '@angular/common/http';
import { Service, computed, linkedSignal, signal } from '@angular/core';
import { URL_API } from './config';
import type { Categoria, Clase, Sobre } from './modelos/clase';
import { mensajeDeError } from './servicios/errores';

/** El filtro: una categoría, o todas. */
export type Filtro = Categoria | 'todas';

@Service()
export class Catalogo {
  // --- Práctica 21: las clases vienen de la API ---------------------------------------
  // httpResource hace GET /clases solo y guarda la respuesta y su estado en signals.
  // parse saca la lista del sobre { data, meta }; defaultValue es lo que vale mientras carga.
  private readonly respuesta = httpResource<Clase[]>(() => `${URL_API}/clases`, {
    parse: (cuerpo) => (cuerpo as Sobre<Clase[]>).data,
    defaultValue: [],
  });

  // --- El estado: signals ---------------------------------------------------------------
  // Mismo nombre y misma forma que cuando eran locales (un signal con las clases): por eso
  // ningún componente tuvo que cambiar. Si la petición falló, value() lanza un error: por
  // eso se pregunta antes con hasValue().
  readonly clases = computed(() => (this.respuesta.hasValue() ? this.respuesta.value() : []));
  readonly categoria = signal<Filtro>('todas');

  // Los estados de la petición, para que la página muestre «cargando» o el error.
  readonly cargando = this.respuesta.isLoading;
  readonly error = computed(() => {
    const error = this.respuesta.error();
    return error ? mensajeDeError(error, 'No se pudo cargar el catálogo.') : null;
  });

  // --- Lo que se calcula: computed() se recalcula sólo cuando cambia lo que lee ------
  readonly visibles = computed(() => {
    const categoria = this.categoria();
    return categoria === 'todas'
      ? this.clases()
      : this.clases().filter((clase) => clase.categoria === categoria);
  });
  readonly minutos = computed(() => this.visibles().reduce((suma, clase) => suma + clase.duracionMin, 0));
  readonly largas = computed(() => this.visibles().filter((clase) => clase.duracionMin >= 60).length);

  // La clase elegida. Es un linkedSignal: se puede cambiar con set() como un signal, pero
  // además se recalcula cada vez que cambian las visibles. Si la elegida ya no está entre
  // ellas (por el filtro, porque se vació el catálogo o porque se eliminó), se suelta.
  // Práctica 22: si sigue ahí, se toma la versión recién llegada de la API (por si se editó).
  readonly seleccionada = linkedSignal<Clase[], Clase | null>({
    source: this.visibles,
    computation: (visibles, anterior) => {
      const elegida = anterior?.value ?? null;
      return elegida ? (visibles.find((clase) => clase.id === elegida.id) ?? null) : null;
    },
  });

  // --- Las acciones -------------------------------------------------------------------
  elegirCategoria(categoria: Filtro) {
    this.categoria.set(categoria);
  }

  seleccionar(clase: Clase) {
    this.seleccionada.set(clase);
  }

  // Vacía la lista en pantalla (no borra nada en la API).
  vaciar() {
    this.respuesta.set([]);
  }

  // Vuelve a pedir GET /clases. También sirve para reintentar después de un error.
  restaurar() {
    this.respuesta.reload();
  }
}
