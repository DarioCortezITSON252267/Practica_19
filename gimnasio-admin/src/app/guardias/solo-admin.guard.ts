// guardias/solo-admin.guard.ts — ESCRITO A MANO (ver la nota de sesion/sesion.ts).
// El guardia del panel: antes de ENTRAR a una ruta protegida, revisa que haya sesión de admin.
// Si no, manda al login y anota a dónde se quería ir. Es la <RutaProtegida> de React.
import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { Sesion } from '../sesion/sesion';

export const soloAdminGuard: CanActivateFn = (_ruta, estado) => {
  if (inject(Sesion).esAdmin()) return true;
  // Regresar un UrlTree es «no entres, mejor ve a esta dirección».
  return inject(Router).createUrlTree(['/login'], { queryParams: { volver: estado.url } });
};
