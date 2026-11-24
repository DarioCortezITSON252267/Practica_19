// app.routes.ts — el mapa de rutas del panel (como el <Routes> de React Router).
// Angular revisa las rutas EN ORDEN y usa la primera que coincide.
import type { Routes } from '@angular/router';
import { cambiosSinGuardarGuard } from './guardias/cambios-sin-guardar.guard';
import { soloAdminGuard } from './guardias/solo-admin.guard';
import { Horarios } from './paginas/horarios/horarios';
import { ListaClases } from './paginas/lista-clases/lista-clases';
import { Login } from './paginas/login/login';
import { Miembros } from './paginas/miembros/miembros';
import { Panel } from './panel/panel';

// Práctica 22: el formulario se carga con loadComponent. Su código queda en otro archivo que
// sólo se baja la primera vez que alguien abre «Nueva clase» o «Editar».
const formularioClase = () =>
  import('./paginas/formulario-clase/formulario-clase').then((m) => m.FormularioClase);

export const routes: Routes = [
  // El login va FUERA del panel: no lleva barra ni pide sesión.
  { path: 'login', component: Login, title: 'Entrar · Gimnasio Titanes' },

  // Práctica 22: el panel es la ruta padre. Su guardia corre antes de entrar a cualquiera de sus
  // hijas, y las hijas se pintan en el <router-outlet> del panel.
  {
    path: '',
    component: Panel,
    canActivate: [soloAdminGuard],
    children: [
      // pathMatch 'full': sólo cuando la URL está vacía completa. '' es el inicio de TODAS las
      // URL; por eso Angular exige escribirlo en esta redirección (sin él: error NG04014).
      { path: '', redirectTo: 'clases', pathMatch: 'full' },
      { path: 'clases', component: ListaClases, title: 'Clases · Gimnasio Titanes' },
      // «nueva» va ANTES que «:id»: si no, ":id" se quedaría con "nueva" como si fuera un id.
      {
        path: 'clases/nueva',
        loadComponent: formularioClase,
        canDeactivate: [cambiosSinGuardarGuard],
        title: 'Nueva clase · Gimnasio Titanes',
      },
      {
        path: 'clases/:id',
        loadComponent: () => import('./paginas/detalle-clase/detalle-clase').then((m) => m.DetalleClase),
        title: 'Detalle de la clase · Gimnasio Titanes',
      },
      {
        path: 'clases/:id/editar',
        loadComponent: formularioClase,
        canDeactivate: [cambiosSinGuardarGuard],
        title: 'Editar clase · Gimnasio Titanes',
      },
      { path: 'horarios', component: Horarios, title: 'Horarios · Gimnasio Titanes' },
      { path: 'miembros', component: Miembros, title: 'Miembros · Gimnasio Titanes' },
    ],
  },

  // El comodín coincide con CUALQUIER dirección: va al final para no tapar a las demás.
  { path: '**', redirectTo: 'clases' },
];
