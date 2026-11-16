// ---------------------------------------------------------------------------
// config.ts — PROVISIONAL: el código base de la Práctica 21 no estaba en la computadora.
// Hace lo mismo que la dirección de la API de React (servicios/api.ts); cuando tengas el
// config.ts del código base, reemplaza este archivo con ése.
// ---------------------------------------------------------------------------

/** Dónde corre gimnasio-backend. */
export const URL_API = 'http://localhost:3000';

/** Las imágenes las sirve la API: /img/clase-01.jpg → http://localhost:3000/img/clase-01.jpg */
export function urlImagen(ruta: string): string {
  return `${URL_API}${ruta}`;
}
