import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '',
    loadComponent: () => import('./components/login/login')
  },
  { path: 'acerca-de',
    loadComponent: () => import('./components/aboutof/aboutof')
  },
  { path: 'principal',
    loadComponent: () => import('./components/principal/principal')
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
  {
    path: 'pagos',
    loadComponent: () => import('./pagos/pagos')
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard')
  },
  {
    path: 'proveedores',
    loadComponent: () => import('./components/proveedores/proveedores')
  },
  {
    path: 'productos',
    loadComponent: () => import('./productos/components/productos-list/productos-list.component')
  },
  {
    path: 'productos/crear',
    loadComponent: () => import('./productos/components/productos-form/productos-form.component')
  },
  {
    path: 'productos/:id/editar',
    loadComponent: () => import('./productos/components/productos-form/productos-form.component')
  },
  {
    path: 'productos/:id',
    loadComponent: () => import('./productos/components/productos-detalle/productos-detalle.component')
  },
  { path: '**',
    redirectTo: ''
  }
];
