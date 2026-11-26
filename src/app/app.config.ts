// app.config.ts — los providers de toda la aplicación (lo que en React envolvía a <App />).
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { sesionVencidaInterceptor } from './interceptores/sesion-vencida.interceptor';
import { tokenInterceptor } from './interceptores/token.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // El router con el mapa de rutas (como el BrowserRouter de React).
    // withComponentInputBinding (Práctica 22): el :id de la URL y los ?parámetros llegan a la
    // página como input(), sin tener que leer la ruta a mano.
    provideRouter(routes, withComponentInputBinding()),
    // HttpClient, para hablar con la API (httpResource lo usa por dentro).
    // Práctica 22: con sus interceptores, que corren en cada petición, en este orden.
    provideHttpClient(withInterceptors([tokenInterceptor, sesionVencidaInterceptor])),
  ],
};
