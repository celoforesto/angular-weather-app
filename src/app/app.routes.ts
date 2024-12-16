import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard'; // Importando o AuthGuard

export const routes: Routes = [
  {
    path: 'search',
    loadComponent: () =>
      import('./components/search/search.component').then((m) => m.SearchComponent),
    canActivate: [AuthGuard], // Protegendo a rota com o AuthGuard
  },
  {
    path: 'favorites',
    loadComponent: () =>
      import('./components/favorites/favorites.component').then((m) => m.FavoritesComponent),
    canActivate: [AuthGuard], // Protegendo a rota com o AuthGuard
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then((m) => m.LoginComponent),
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];