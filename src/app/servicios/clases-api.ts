// ClasesApi — Práctica 22 · las llamadas a /clases con HttpClient.
// Lo genera el CLI: npx ng generate service servicios/clases-api
// Práctica 23: también la búsqueda (GET /clases?q=), que usa el tubo de RxJS de Catalogo.
import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { map, type Observable } from 'rxjs';
import { URL_API } from '../config';
import type { Clase, ClaseConHorarios, ClaseNueva, Sobre } from '../modelos/clase';

@Service()
export class ClasesApi {
  private readonly http = inject(HttpClient);

  /**
   * Práctica 23 · GET /clases?q=yoga → las clases cuyo nombre contiene «yoga».
   * Con el texto vacío no se manda q y la API regresa todas.
   */
  buscar(q: string): Observable<Clase[]> {
    const params: Record<string, string> = q ? { q } : {};
    return this.http
      .get<Sobre<Clase[]>>(`${URL_API}/clases`, { params })
      .pipe(map((respuesta) => respuesta.data));
  }

  /** POST /clases → la clase creada (con su id). Sólo un admin puede: sin token responde 401. */
  crear(clase: ClaseNueva): Observable<Clase> {
    return this.http.post<Sobre<Clase>>(`${URL_API}/clases`, clase).pipe(map((respuesta) => respuesta.data));
  }

  /** Práctica 22 · GET /clases/:id → la clase con sus horarios (para llenar el formulario al editar). */
  obtener(id: number): Observable<ClaseConHorarios> {
    return this.http.get<Sobre<ClaseConHorarios>>(`${URL_API}/clases/${id}`).pipe(map((respuesta) => respuesta.data));
  }

  /** Práctica 22 · PATCH /clases/:id → la clase con los cambios. Sólo admin. */
  actualizar(id: number, cambios: Partial<ClaseNueva>): Observable<Clase> {
    return this.http
      .patch<Sobre<Clase>>(`${URL_API}/clases/${id}`, cambios)
      .pipe(map((respuesta) => respuesta.data));
  }

  /** Práctica 22 · DELETE /clases/:id → la clase borrada (con ella se van sus horarios). Sólo admin. */
  eliminar(id: number): Observable<Clase> {
    return this.http.delete<Sobre<Clase>>(`${URL_API}/clases/${id}`).pipe(map((respuesta) => respuesta.data));
  }
}
