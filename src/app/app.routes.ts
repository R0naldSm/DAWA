import { Routes } from '@angular/router';

export const routes: Routes = [
  // --- TUS MÓDULOS (Login y Proveedores) ---
  // IMPORTANTE: Usamos .then(m => m.NombreClase) porque usas 'export class'
  {
    path: '',
    loadComponent: () => import('./components/login/login').then(m => m.Login)
  },
  {
    path: 'proveedores',
    loadComponent: () => import('./components/proveedores/proveedores').then(m => m.Proveedores)
  },
  {
    path: 'principal',
    loadComponent: () => import('./components/principal/principal').then(m => m.Principal)
  },

  // --- MÓDULOS DE PEDIDOS (DIEGO) ---
  // Descomenta uno por uno y verifica el nombre de la clase si falla (ej: m.ListaPedidos vs m.PedidosList)

  {
    path: 'pedidos',
    redirectTo: 'pedidos/1',
  },
  {
    path: 'pedidos/:pagina',
    loadComponent: () => import('./pedidos/components/lista-pedidos/lista-pedidos').then(m => m.ListaPedidos)
  },
  {
    path: 'pedido/crear',
    loadComponent: () => import('./pedidos/components/nuevo-pedido/nuevo-pedido').then(m => m.NuevoPedido)
  },
  {
    path: 'pedido/editar/:id',
    loadComponent: () => import('./pedidos/components/nuevo-pedido/nuevo-pedido').then(m => m.NuevoPedido)
  },


  // --- OTROS COMPONENTES ---
  // Si tienes estos archivos, descoméntalos. Si no, déjalos así para que no falle.
  {
    path: 'acerca-de',
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
    loadComponent: () => import('./productos/components/productos-list/productos-list.component').then(m => m.ProductosList)
  },

  {
    path: '**',
    redirectTo: ''
  }
];
