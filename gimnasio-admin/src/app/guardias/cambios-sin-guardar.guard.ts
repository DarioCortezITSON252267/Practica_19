// guardias/cambios-sin-guardar.guard.ts — Práctica 22 · la guarda de SALIDA (canDeactivate).
// Antes de dejar la página del formulario, le pregunta al componente si se puede salir.
import type { CanDeactivateFn } from '@angular/router';

/** Lo que tiene que ofrecer una página para usar esta guarda. */
export interface ConCambiosSinGuardar {
  puedeSalir(): boolean;
}

export const cambiosSinGuardarGuard: CanDeactivateFn<ConCambiosSinGuardar> = (pagina) => pagina.puedeSalir();
