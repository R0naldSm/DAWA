import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Estadistica {
  titulo: string;
  valor: number | string;
  icono: string;
  color: string;
  cambio?: string;
}

interface Pedido {
  id: number;
  producto: string;
  proveedor: string;
  estado: string;
  fecha: string;
}

interface Producto {
  nombre: string;
  cantidad: number;
  color: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export default class DashboardComponent implements OnInit {
  estadisticas: Estadistica[] = [];
  pedidosRecientes: Pedido[] = [];
  productosPopulares: Producto[] = [];
  ventasMensuales: any[] = [];
  
  ngOnInit() {
    this.cargarEstadisticas();
    this.cargarPedidosRecientes();
    this.cargarProductosPopulares();
    this.cargarVentasMensuales();
  }

  cargarEstadisticas() {
    this.estadisticas = [
      {
        titulo: 'Total Proveedores',
        valor: 24,
        icono: 'bi-people-fill',
        color: 'primary',
        cambio: '+3 este mes'
      },
      {
        titulo: 'Productos Activos',
        valor: 156,
        icono: 'bi-box-seam',
        color: 'success',
        cambio: '+12 nuevos'
      },
      {
        titulo: 'Pedidos Pendientes',
        valor: 8,
        icono: 'bi-cart-check',
        color: 'warning',
        cambio: '3 urgentes'
      },
      {
        titulo: 'Ventas del Mes',
        valor: '$45,280',
        icono: 'bi-graph-up-arrow',
        color: 'info',
        cambio: '+18% vs mes anterior'
      },
      {
        titulo: 'Entregas Completadas',
        valor: 142,
        icono: 'bi-truck',
        color: 'success',
        cambio: '98% a tiempo'
      },
      {
        titulo: 'Pagos Pendientes',
        valor: '$8,450',
        icono: 'bi-cash-stack',
        color: 'danger',
        cambio: '5 facturas'
      }
    ];
  }

  cargarPedidosRecientes() {
    this.pedidosRecientes = [
      {
        id: 1001,
        producto: 'Semillas de Maíz Premium',
        proveedor: 'AgroSemillas del Ecuador',
        estado: 'En Tránsito',
        fecha: '2025-11-16'
      },
      {
        id: 1002,
        producto: 'Fertilizante Orgánico 50kg',
        proveedor: 'Fertilizantes La Costa',
        estado: 'Pendiente',
        fecha: '2025-11-17'
      },
      {
        id: 1003,
        producto: 'Pesticida Natural 20L',
        proveedor: 'Pesticidas Naturales SA',
        estado: 'Completado',
        fecha: '2025-11-15'
      },
      {
        id: 1004,
        producto: 'Sistema de Riego por Goteo',
        proveedor: 'Herramientas Agrícolas',
        estado: 'En Tránsito',
        fecha: '2025-11-16'
      },
      {
        id: 1005,
        producto: 'Semillas de Arroz',
        proveedor: 'AgroSemillas del Ecuador',
        estado: 'Pendiente',
        fecha: '2025-11-17'
      }
    ];
  }

  cargarProductosPopulares() {
    this.productosPopulares = [
      { nombre: 'Semillas', cantidad: 45, color: 'success' },
      { nombre: 'Fertilizantes', cantidad: 38, color: 'primary' },
      { nombre: 'Pesticidas', cantidad: 32, color: 'warning' },
      { nombre: 'Herramientas', cantidad: 25, color: 'info' },
      { nombre: 'Equipos de Riego', cantidad: 16, color: 'secondary' }
    ];
  }

  cargarVentasMensuales() {
    this.ventasMensuales = [
      { mes: 'Jun', ventas: 28500 },
      { mes: 'Jul', ventas: 32800 },
      { mes: 'Ago', ventas: 35200 },
      { mes: 'Sep', ventas: 38900 },
      { mes: 'Oct', ventas: 42100 },
      { mes: 'Nov', ventas: 45280 }
    ];
  }

  getEstadoClass(estado: string): string {
    const clases: any = {
      'Completado': 'badge bg-success',
      'En Tránsito': 'badge bg-primary',
      'Pendiente': 'badge bg-warning text-dark',
      'Cancelado': 'badge bg-danger'
    };
    return clases[estado] || 'badge bg-secondary';
  }

  getPorcentajeProducto(cantidad: number): number {
    const max = Math.max(...this.productosPopulares.map(p => p.cantidad));
    return (cantidad / max) * 100;
  }

  getMaxVentas(): number {
    return Math.max(...this.ventasMensuales.map(v => v.ventas));
  }

  getAlturaGrafico(ventas: number): number {
    return (ventas / this.getMaxVentas()) * 100;
  }
}
