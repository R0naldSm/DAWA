import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '',
    loadComponent: () => import('./components/login/login')
  },
  { path: 'acerca-de',
    loadComponent: () => import('./components/aboutof/aboutof')
  },
  {
    path: 'pedidos',
    redirectTo: 'pedidos/1',
  },
  {
    path: 'pedidos/:pagina',
    loadComponent: () => import('./pedidos/components/lista-pedidos/lista-pedidos')
  },
  { path: '**', 
    redirectTo: '' 
  }
];
