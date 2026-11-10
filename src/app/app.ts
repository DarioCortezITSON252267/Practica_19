// <app-root> — el componente raíz: el tablero del panel de administración.
// Hace el papel de App.tsx en React.
import { Component, inject } from '@angular/core';
import { Catalogo } from './catalogo';
import { FiltroCategoria } from './filtro-categoria/filtro-categoria';
import { TarjetaClase } from './tarjeta-clase/tarjeta-clase';

@Component({
  selector: 'app-root',
  // Standalone: cada componente dice qué otros componentes usa en su template.
  // Sin TarjetaClase aquí, <app-tarjeta-clase> no se reconoce (error NG8001).
  imports: [TarjetaClase, FiltroCategoria],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  // Práctica 20: el tablero ya no tiene estado propio. Las clases, el filtro, la clase
  // elegida y el resumen viven en el servicio Catalogo; aquí sólo se leen y se cambian.
  protected readonly catalogo = inject(Catalogo);
}
