// <app-root> — el componente raíz: el tablero del panel de administración.
// Hace el papel de App.tsx en React.
import { Component, computed, signal } from '@angular/core';
import { CLASES_LOCALES } from './datos/clases-locales';
import type { Clase } from './modelos/clase';
import { TarjetaClase } from './tarjeta-clase/tarjeta-clase';

@Component({
  selector: 'app-root',
  // Standalone: cada componente dice qué otros componentes usa en su template.
  // Sin TarjetaClase aquí, <app-tarjeta-clase> no se reconoce (error NG8001).
  imports: [TarjetaClase],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  // Las clases del tablero. Es un signal: al cambiarlo con set(), el template se vuelve a pintar.
  protected readonly clases = signal<Clase[]>(CLASES_LOCALES);

  // El resumen sale de las clases. computed() lo recalcula sólo cuando cambian.
  protected readonly totalClases = computed(() => this.clases().length);
  protected readonly minutosSemana = computed(() =>
    this.clases().reduce((suma, clase) => suma + clase.duracionMin, 0),
  );
  protected readonly clasesLargas = computed(
    () => this.clases().filter((clase) => clase.duracionMin >= 60).length,
  );

  // Los dos botones: vaciar el catálogo (para ver el @empty) y volver a llenarlo.
  protected vaciar() {
    this.clases.set([]);
  }

  protected restaurar() {
    this.clases.set(CLASES_LOCALES);
  }
}
