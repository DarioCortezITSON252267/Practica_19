// <app-root> — el componente raíz. Desde la Práctica 22 sólo tiene el <router-outlet>: la barra
// vive en el panel (panel/), porque el login no la lleva.
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
