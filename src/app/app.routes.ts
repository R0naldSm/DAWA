import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '',
    loadComponent: () => import('./components/login/login')
  },
  { path: 'acerca-de',
    loadComponent: () => import('./components/aboutof/aboutof')
  },
  { path: '**', 
    redirectTo: '' 
  }
];
