// Catalogo — el servicio con el estado del tablero, hecho con signals. Lo genera el CLI:
// npx ng generate service catalogo
// @Service() lo deja disponible en toda la aplicación: hay UNA sola instancia, y cada
// componente que hace inject(Catalogo) recibe esa misma.
import { Service, computed, inject, linkedSignal, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, catchError, map, of, startWith, switchMap } from 'rxjs';
import type { Categoria, Clase } from './modelos/clase';
import { ClasesApi } from './servicios/clases-api';
import { mensajeDeError } from './servicios/errores';

/** El filtro: una categoría, o todas. */
export type Filtro = Categoria | 'todas';

/** Práctica 23 · lo que sale del tubo de búsqueda en cada momento. */
interface EstadoBusqueda {
  clases: Clase[];
  cargando: boolean;
  error: string | null;
}

@Service()
export class Catalogo {
  private readonly api = inject(ClasesApi);

  // --- Práctica 23: el tubo de búsqueda con RxJS ---------------------------------------
  // (Antes, en la 21 y la 22, aquí había un httpResource que sólo sabía pedir GET /clases.)
  // El texto que se busca vive en un BehaviorSubject: guarda el último valor y se lo da a quien
  // se suscribe. Empieza en '' (todas las clases).
  private readonly busqueda$ = new BehaviorSubject<string>('');

  // Cada texto nuevo se convierte en una petición GET /clases?q=… con switchMap: si llega otro
  // texto antes de que responda la API, switchMap CANCELA la petición vieja y se queda con la
  // nueva. catchError y startWith van ADENTRO del switchMap, en la petición de cada búsqueda:
  //  - startWith: mientras llega la respuesta, el estado es «cargando».
  //  - catchError: si la petición falla, el error se vuelve un estado más (con su mensaje) y el
  //    tubo sigue vivo para la siguiente búsqueda.
  private readonly estado$ = this.busqueda$.pipe(
    switchMap((q) =>
      this.api.buscar(q).pipe(
        map((clases): EstadoBusqueda => ({ clases, cargando: false, error: null })),
        catchError((error: unknown) =>
          of<EstadoBusqueda>({
            clases: [],
            cargando: false,
            error: mensajeDeError(error, 'No se pudo cargar el catálogo.'),
          }),
        ),
        startWith<EstadoBusqueda>({ clases: [], cargando: true, error: null }),
      ),
    ),
  );

  // toSignal se suscribe al Observable y deja su último valor en un signal, para que los
  // componentes lo lean igual que antes. requireSync: el BehaviorSubject y el startWith dan un
  // valor en cuanto alguien se suscribe, así que el signal nunca está vacío.
  private readonly estado = toSignal(this.estado$, { requireSync: true });
  readonly textoBuscado = toSignal(this.busqueda$, { requireSync: true });

  // --- El estado: signals ---------------------------------------------------------------
  // Mismo nombre y misma forma de antes: por eso los componentes no tuvieron que cambiar.
  // Es un linkedSignal para dos cosas: mientras llega una búsqueda se quedan a la vista las
  // clases anteriores (en lugar de vaciar el tablero en cada tecla), y vaciar() puede hacer set([]).
  readonly clases = linkedSignal<EstadoBusqueda, Clase[]>({
    source: this.estado,
    computation: (estado, anterior) => (estado.cargando ? (anterior?.value ?? []) : estado.clases),
  });
  readonly categoria = signal<Filtro>('todas');

  // Los estados de la petición, para que la página muestre «cargando» o el error.
  readonly cargando = computed(() => this.estado().cargando);
  readonly error = computed(() => this.estado().error);

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
  // ellas (por el filtro, por la búsqueda, porque se vació el catálogo o porque se eliminó),
  // se suelta. Práctica 22: si sigue ahí, se toma la versión recién llegada de la API.
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

  /** Práctica 23 · busca por nombre: mete el texto al tubo y switchMap hace la petición. */
  buscar(texto: string) {
    this.busqueda$.next(texto);
  }

  /**
   * Vuelve a pedir la búsqueda actual a la API (después de guardar o eliminar, o para
   * reintentar después de un error). Manda OTRA VEZ el mismo texto al BehaviorSubject: como el
   * distinctUntilChanged está en la caja de búsqueda y no aquí, el mismo texto sí pasa.
   */
  recargar() {
    this.busqueda$.next(this.busqueda$.value);
  }

  // Vacía la lista en pantalla (no borra nada en la API).
  vaciar() {
    this.clases.set([]);
  }
}
