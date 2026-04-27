import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    // Escucha errores globales del navegador
    provideBrowserGlobalErrorListeners(),
    // Habilita HttpClient para hacer peticiones al backend
    provideHttpClient(withFetch()),
    // Proporciona hidratación para SSR si se usa en el proyecto
    provideClientHydration(withEventReplay())
  ]
};
