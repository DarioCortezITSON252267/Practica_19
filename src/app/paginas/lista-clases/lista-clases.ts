// <app-lista-clases> — Práctica 21 · la página /clases. Es el tablero de la Práctica 20,
// mudado aquí desde app.html: el estado sigue viviendo en el servicio Catalogo.
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Catalogo } from '../../catalogo';
import { urlImagen } from '../../config';
import { FiltroCategoria } from '../../filtro-categoria/filtro-categoria';
import { TarjetaClase } from '../../tarjeta-clase/tarjeta-clase';

@Component({
  imports: [TarjetaClase, FiltroCategoria, RouterLink],
  selector: 'app-lista-clases',
  styleUrl: './lista-clases.css',
  templateUrl: './lista-clases.html',
})
export class ListaClases {
  protected readonly catalogo = inject(Catalogo);
  protected readonly urlImagen = urlImagen;
}
