import { Routes } from '@angular/router';

export const routes: Routes = [
  // 1. RUTA RAÍZ ('') -> AHORA ES ACERCA DE
  {
    path: '',
    loadComponent: () => import('./components/aboutof/aboutof').then(m => m.Aboutof)
  },
  // 2. NUEVA RUTA EXPLÍCITA PARA LOGIN
  {
    path: 'login',
    loadComponent: () => import('./components/login/login').then(m => m.Login)
  },
  {
    path: 'principal',
    loadComponent: () => import('./components/principal/principal').then(m => m.Principal)
  },
  {
    path: 'proveedores',
    loadComponent: () => import('./components/proveedores/proveedores').then(m => m.Proveedores)
  },

  // --- PEDIDOS ---
  {
    path: 'pedidos',
    loadComponent: () => import('./pedidos/components/lista-pedidos/lista-pedidos').then(m => m.ListaPedidos)
  },
  {
    path: 'pedido/crear',
    loadComponent: () => import('./pedidos/components/form-pedidos/form-pedidos').then(m => m.NuevoPedido)
  },
  {
    path: 'pedido/editar/:id',
    loadComponent: () => import('./pedidos/components/form-pedidos/form-pedidos').then(m => m.NuevoPedido)
  },

  // --- OTROS ---
  {
    path: 'acerca-de', // Por si alguien escribe manual /acerca-de
    loadComponent: () => import('./components/aboutof/aboutof').then(m => m.Aboutof)
  },
  {
    path: 'pagos',
    loadComponent: () => import('./components/pagos/pagos').then(m => m.Pagos)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard').then(m => m.Dashboard)
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

  {
    path: '**',
    redirectTo: ''
  }
];
