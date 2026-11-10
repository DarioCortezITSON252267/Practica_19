// <app-tarjeta-clase> — la tarjeta de UNA clase. La genera el CLI:
// npx ng generate component tarjeta-clase
import { Component, input, output } from '@angular/core';
import type { Clase } from '../modelos/clase';

@Component({
  selector: 'app-tarjeta-clase',
  imports: [],
  templateUrl: './tarjeta-clase.html',
  styleUrl: './tarjeta-clase.css',
})
export class TarjetaClase {
  // ENTRADAS: del padre hacia la tarjeta. input() es como una prop de React.
  // La clase llega así: <app-tarjeta-clase [clase]="clase" />. required: si el padre no la
  // manda, no compila. Es un signal: en el template se lee con paréntesis, clase().
  readonly clase = input.required<Clase>();
  // Práctica 20: el padre la marca cuando es la clase elegida: [activa]="true".
  readonly activa = input(false);

  // SALIDA: de la tarjeta hacia el padre. output() es como pasarle onElegir en React: la
  // tarjeta sólo avisa con emit(), y qué hacer con la clase lo decide el padre en (elegir).
  readonly elegir = output<Clase>();
}
