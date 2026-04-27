import { Routes } from '@angular/router';

export const routes: Routes = [
  // Rutas básicas - el proyecto usa navegación por señales, no rutas
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: '**', redirectTo: '/' }
];
