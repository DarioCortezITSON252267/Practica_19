// ---------------------------------------------------------------------------
// servicios/errores.ts — PROVISIONAL: el código base de la Práctica 21 no estaba en la
// computadora. Es el mensajeDeError() de React (servicios/api.ts) pasado a HttpClient; cuando
// tengas el errores.ts del código base, reemplaza este archivo con ése.
// ---------------------------------------------------------------------------
import { HttpErrorResponse } from '@angular/common/http';

/** El mensaje que se le enseña a la persona cuando una petición falla. */
export function mensajeDeError(e: unknown, generico: string): string {
  if (e instanceof HttpErrorResponse) {
    // status 0: la petición ni siquiera llegó (API apagada, CORS, sin red).
    if (e.status === 0) return 'No se pudo conectar con la API. ¿Está encendida?';
    const mensaje: unknown = e.error?.message; // 400 trae un arreglo; 403, 404 y 409, un texto
    if (Array.isArray(mensaje)) return mensaje.join('. ');
    if (typeof mensaje === 'string') return mensaje;
  }
  return generico;
}
