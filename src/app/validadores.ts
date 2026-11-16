// validadores.ts — Práctica 21 · validadores propios para los formularios reactivos.
import type { ValidatorFn } from '@angular/forms';

// La duración va en bloques de 5 minutos: 45 sí, 47 no.
// Un validador recibe el control y regresa null si el valor es válido, o un objeto con el
// error si no lo es. La clave del objeto ('bloquesDe5') es la que se pregunta después con
// control.hasError('bloquesDe5'), y lo de adentro sirve para armar el mensaje.
export const bloquesDe5: ValidatorFn = (control) => {
  const valor = control.value;
  if (valor === null || valor === '') return null; // vacío: de eso se encarga Validators.required
  return valor % 5 === 0 ? null : { bloquesDe5: { valor, sugerido: Math.round(valor / 5) * 5 } };
};
