// app.routes.ts — Práctica 21 · el mapa de rutas del panel (como el <Routes> de React Router).
// Angular revisa las rutas EN ORDEN y usa la primera que coincide.
import type { Routes } from '@angular/router';
import { FormularioClase } from './paginas/formulario-clase/formulario-clase';
import { Horarios } from './paginas/horarios/horarios';
import { ListaClases } from './paginas/lista-clases/lista-clases';
import { Miembros } from './paginas/miembros/miembros';

export const routes: Routes = [
  // La ruta vacía manda a /clases. pathMatch 'full': sólo cuando la URL está vacía completa.
  // '' es el inicio de TODAS las URL, así que con 'prefix' (el valor por defecto) coincidiría con
  // cualquiera; por eso Angular exige escribirlo en esta redirección (sin él: error NG04014).
  { path: '', redirectTo: 'clases', pathMatch: 'full' },

  { path: 'clases', component: ListaClases, title: 'Clases · Gimnasio Titanes' },
  { path: 'clases/nueva', component: FormularioClase, title: 'Nueva clase · Gimnasio Titanes' },
  { path: 'horarios', component: Horarios, title: 'Horarios · Gimnasio Titanes' },
  { path: 'miembros', component: Miembros, title: 'Miembros · Gimnasio Titanes' },

  // El comodín coincide con CUALQUIER dirección: va al final para no tapar a las demás.
  { path: '**', redirectTo: 'clases' },
];
