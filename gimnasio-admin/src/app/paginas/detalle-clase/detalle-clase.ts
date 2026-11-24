// <app-detalle-clase> — Práctica 22 (opcional) · la página /clases/:id: la clase con sus horarios.
import { Component, input } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { URL_API, urlImagen } from '../../config';
import type { ClaseConHorarios, Sobre } from '../../modelos/clase';
import { mensajeDeError } from '../../servicios/errores';

@Component({
  imports: [RouterLink],
  selector: 'app-detalle-clase',
  styleUrl: './detalle-clase.css',
  templateUrl: './detalle-clase.html',
})
export class DetalleClase {
  // El :id de la URL, como input (withComponentInputBinding).
  readonly id = input.required<string>();

  // Para LEER se usa httpResource: depende del signal id(), así que si cambia la URL
  // (de /clases/1 a /clases/2), la petición se repite sola.
  protected readonly clase = httpResource<ClaseConHorarios>(() => `${URL_API}/clases/${this.id()}`, {
    parse: (cuerpo) => (cuerpo as Sobre<ClaseConHorarios>).data,
  });

  protected readonly urlImagen = urlImagen;
  protected mensaje(error: unknown) {
    return mensajeDeError(error, 'No se pudo cargar la clase.');
  }
}
