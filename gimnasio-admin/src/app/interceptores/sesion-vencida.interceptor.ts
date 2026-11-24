// interceptores/sesion-vencida.interceptor.ts — ESCRITO A MANO (ver la nota de sesion/sesion.ts).
// Mira cada RESPUESTA: si la API dice 401 (token vencido o inválido), cierra la sesión y manda al
// login. Es el interceptor de respuesta de Axios de la Práctica 17 de React.
import { HttpErrorResponse, type HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Sesion } from '../sesion/sesion';

export const sesionVencidaInterceptor: HttpInterceptorFn = (peticion, siguiente) => {
  const sesion = inject(Sesion);
  return siguiente(peticion).pipe(
    catchError((error: unknown) => {
      // En el login un 401 sólo quiere decir «contraseña equivocada»: ahí no se cierra nada.
      if (error instanceof HttpErrorResponse && error.status === 401 && !peticion.url.endsWith('/auth/login')) {
        sesion.salir();
      }
      return throwError(() => error); // quien hizo la petición sigue recibiendo el error
    }),
  );
};
