// <app-panel> — ESCRITO A MANO (ver la nota de sesion/sesion.ts). El marco del panel: la barra
// con los enlaces, quién entró y «Salir», y el hueco donde se pintan las páginas hijas.
// Es el <Layout> con <Outlet /> de React.
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Sesion } from '../sesion/sesion';

@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  selector: 'app-panel',
  styleUrl: './panel.css',
  templateUrl: './panel.html',
})
export class Panel {
  protected readonly sesion = inject(Sesion);
}
