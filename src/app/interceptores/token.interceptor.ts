// interceptores/token.interceptor.ts — ESCRITO A MANO (ver la nota de sesion/sesion.ts).
// Antes de que salga CUALQUIER petición de HttpClient a la API, le pone el token del admin en
// el encabezado Authorization. Es el interceptor de petición de Axios de la Práctica 16 de React.
import type { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { URL_API } from '../config';
import { Sesion } from '../sesion/sesion';

export const tokenInterceptor: HttpInterceptorFn = (peticion, siguiente) => {
  const token = inject(Sesion).token();
  // Sin sesión, o si la petición no es a NUESTRA API (para no regalar el token), va tal cual.
  if (!token || !peticion.url.startsWith(URL_API)) return siguiente(peticion);
  // Las peticiones no se modifican: se clonan con el encabezado nuevo.
  return siguiente(peticion.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
};
