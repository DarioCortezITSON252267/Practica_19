// <app-lista-clases> — Práctica 21 · la página /clases. Es el tablero de la Práctica 20,
// mudado aquí desde app.html: el estado sigue viviendo en el servicio Catalogo.
// Práctica 23: la caja de búsqueda.
import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';
import { Catalogo } from '../../catalogo';
import { urlImagen } from '../../config';
import { FiltroCategoria } from '../../filtro-categoria/filtro-categoria';
import { TarjetaClase } from '../../tarjeta-clase/tarjeta-clase';

@Component({
  imports: [TarjetaClase, FiltroCategoria, RouterLink, ReactiveFormsModule],
  selector: 'app-lista-clases',
  styleUrl: './lista-clases.css',
  templateUrl: './lista-clases.html',
})
export class ListaClases {
  protected readonly catalogo = inject(Catalogo);
  protected readonly urlImagen = urlImagen;

  // Práctica 23 · la caja de búsqueda es un FormControl suelto (no hace falta un FormGroup).
  // Empieza con lo último que se buscó: el servicio lo recuerda aunque se cambie de página.
  protected readonly busqueda = new FormControl(this.catalogo.textoBuscado(), { nonNullable: true });

  constructor() {
    // valueChanges avisa en cada tecla. Antes de buscar:
    //  - debounceTime(300): espera a que se deje de teclear 300 ms; las teclas de en medio no salen.
    //  - map(trim): «yoga » y «yoga» son la misma búsqueda.
    //  - distinctUntilChanged(): si el texto quedó igual que el anterior, no se busca otra vez.
    //  - takeUntilDestroyed(): al salir de la página se termina la suscripción (si no, seguiría
    //    viva y cada visita sumaría otra). Usa inject() por dentro, así que sólo funciona aquí,
    //    en el constructor; en ngOnInit da el error NG0203.
    this.busqueda.valueChanges
      .pipe(
        debounceTime(300),
        map((texto) => texto.trim()),
        distinctUntilChanged(),
        takeUntilDestroyed(),
      )
      .subscribe((texto) => this.catalogo.buscar(texto));
  }
}
