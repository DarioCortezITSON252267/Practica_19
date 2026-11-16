// app.config.ts — los providers de toda la aplicación (lo que en React envolvía a <App />).
import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // Práctica 21 · el router con el mapa de rutas (como el BrowserRouter de React).
    provideRouter(routes),
    // Práctica 21 · HttpClient, para hablar con la API (httpResource lo usa por dentro).
    provideHttpClient(),
  ],
};
