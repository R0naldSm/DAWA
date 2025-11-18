import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '',
    loadComponent: () => import('./components/login/login')
  },
  { path: 'acerca-de',
    loadComponent: () => import('./components/aboutof/aboutof')
  },
  { path: 'inicio',
    loadComponent: () => import('./components/principal/pag-principal/pag-principal')
  },
  {
    path: 'pedidos',
    redirectTo: 'pedidos/1',
  },
  {
    path: 'pedidos/:pagina',
    loadComponent: () => import('./pedidos/components/lista-pedidos/lista-pedidos')
  },
  {
    path: 'pedido/crear',
    loadComponent: () => import('./pedidos/components/nuevo-pedido/nuevo-pedido')
  },
  { path: '**', 
    redirectTo: '' 
  }
];
