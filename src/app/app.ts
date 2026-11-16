// <app-root> — el componente raíz: la barra y el hueco donde el router pinta cada página.
// Hace el papel del <Layout> de React.
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  // Standalone: cada componente dice qué usa en su template. Sin RouterOutlet,
  // <router-outlet> no se reconoce; sin RouterLink, routerLink no hace nada.
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
