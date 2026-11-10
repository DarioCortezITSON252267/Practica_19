// Catalogo — el servicio con el estado del tablero, hecho con signals. Lo genera el CLI:
// npx ng generate service catalogo
// @Service() lo deja disponible en toda la aplicación: hay UNA sola instancia, y cada
// componente que hace inject(Catalogo) recibe esa misma.
import { Service, computed, linkedSignal, signal } from '@angular/core';
import { CLASES_LOCALES } from './datos/clases-locales';
import type { Categoria, Clase } from './modelos/clase';

/** El filtro: una categoría, o todas. */
export type Filtro = Categoria | 'todas';

@Service()
export class Catalogo {
  // --- El estado: signals que se cambian con set() --------------------------------
  readonly clases = signal<Clase[]>(CLASES_LOCALES);
  readonly categoria = signal<Filtro>('todas');

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
  // ellas (por el filtro o porque se vació el catálogo), se suelta.
  readonly seleccionada = linkedSignal<Clase[], Clase | null>({
    source: this.visibles,
    computation: (visibles, anterior) => {
      const elegida = anterior?.value ?? null;
      return elegida && visibles.some((clase) => clase.id === elegida.id) ? elegida : null;
    },
  });

  // --- Las acciones -------------------------------------------------------------------
  elegirCategoria(categoria: Filtro) {
    this.categoria.set(categoria);
  }

  seleccionar(clase: Clase) {
    this.seleccionada.set(clase);
  }

  vaciar() {
    this.clases.set([]);
  }

  restaurar() {
    this.clases.set(CLASES_LOCALES);
  }
}
