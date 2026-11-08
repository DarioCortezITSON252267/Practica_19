// <app-tarjeta-clase> — la tarjeta de UNA clase. La genera el CLI:
// npx ng generate component tarjeta-clase
import { Component, input } from '@angular/core';
import type { Clase } from '../modelos/clase';

@Component({
  selector: 'app-tarjeta-clase',
  imports: [],
  templateUrl: './tarjeta-clase.html',
  styleUrl: './tarjeta-clase.css',
})
export class TarjetaClase {
  // La clase llega del padre: <app-tarjeta-clase [clase]="clase" />.
  // input() es como una prop de React. required: si el padre no la manda, no compila.
  // Es un signal: en el template se lee con paréntesis, clase().
  readonly clase = input.required<Clase>();
}
