// <app-filtro-categoria> — los botones para filtrar por categoría. Lo genera el CLI:
// npx ng generate component filtro-categoria
// No recibe nada del padre: con inject() toma el MISMO Catalogo que usa el tablero, y al
// cambiar la categoría ahí, el tablero se entera solo.
import { Component, inject } from '@angular/core';
import { Catalogo, type Filtro } from '../catalogo';
import { CATEGORIAS } from '../modelos/clase';

@Component({
  imports: [],
  selector: 'app-filtro-categoria',
  styleUrl: './filtro-categoria.css',
  templateUrl: './filtro-categoria.html',
})
export class FiltroCategoria {
  protected readonly catalogo = inject(Catalogo);
  protected readonly opciones: Filtro[] = ['todas', ...CATEGORIAS];
}
