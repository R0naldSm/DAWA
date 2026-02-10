import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DashboardService } from '../../services/dashboardService';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  private auth = inject(AuthService);
  private router = inject(Router);

  // Datos del dashboard
  estadisticas: any = {};
  pedidosRecientes: any[] = [];
  productosPopulares: any[] = [];
  ventasMensuales: any[] = [];

  // Estados de carga
  cargandoEstadisticas: boolean = true;
  cargandoPedidos: boolean = true;
  cargandoProductos: boolean = true;
  cargandoVentas: boolean = true;

  // Error handling
  errorEstadisticas: string | null = null;
  errorPedidos: string | null = null;
  errorProductos: string | null = null;
  errorVentas: string | null = null;

  // Información del usuario
  nombreUsuario: string = '';
  fechaActual: string = '';

  ngOnInit() {
    this.inicializarDashboard();
  }

  inicializarDashboard() {
    // Configurar fecha actual
    this.fechaActual = new Date().toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Obtener usuario actual
    this.auth.usuarioActual$.subscribe({
      next: (user) => {
        if (user) {
          this.nombreUsuario = user.Nombres || user.nombre || user.email || 'Usuario';
          this.cargarTodosLosDatos();
        } else {
          console.error('❌ No hay usuario autenticado');
          this.router.navigate(['/']);
        }
      },
      error: (error) => {
        console.error('❌ Error obteniendo usuario:', error);
        this.router.navigate(['/']);
      }
    });
  }

  cargarTodosLosDatos() {
    this.cargarEstadisticas();
    this.cargarPedidosRecientes();
    this.cargarProductosPopulares();
    this.cargarVentasMensuales();
  }

  cargarEstadisticas() {
    this.cargandoEstadisticas = true;
    this.errorEstadisticas = null;

    this.dashboardService.getEstadisticas().subscribe({
      next: (data) => {
        this.estadisticas = data;
        this.cargandoEstadisticas = false;
        console.log('✅ Estadísticas cargadas:', data);
      },
      error: (error) => {
        console.error('❌ Error cargando estadísticas:', error);
        this.errorEstadisticas = 'No se pudieron cargar las estadísticas';
        this.cargandoEstadisticas = false;

        // Datos de ejemplo para desarrollo
        if (error.status === 0 || error.status === 404) {
          this.estadisticas = {
            totalVentas: 125000,
            totalPedidos: 45,
            totalClientes: 28,
            totalProductos: 156,
            ventasMensuales: 45000,
            pedidosPendientes: 12
          };
          this.cargandoEstadisticas = false;
        }
      }
    });
  }

  cargarPedidosRecientes() {
    this.cargandoPedidos = true;
    this.errorPedidos = null;

    this.dashboardService.getPedidosRecientes().subscribe({
      next: (data) => {
        this.pedidosRecientes = data.slice(0, 5); // Solo los 5 más recientes
        this.cargandoPedidos = false;
        console.log('✅ Pedidos recientes cargados:', data.length);
      },
      error: (error) => {
        console.error('❌ Error cargando pedidos recientes:', error);
        this.errorPedidos = 'No se pudieron cargar los pedidos recientes';
        this.cargandoPedidos = false;

        // Datos de ejemplo para desarrollo
        if (error.status === 0 || error.status === 404) {
          this.pedidosRecientes = [
            { idPedido: 1, numeroPedido: 'PED-001', cliente: 'Juan Pérez', fecha: '2024-01-15', estado: 'Completado', total: 2500 },
            { idPedido: 2, numeroPedido: 'PED-002', cliente: 'María García', fecha: '2024-01-14', estado: 'En proceso', total: 1800 },
            { idPedido: 3, numeroPedido: 'PED-003', cliente: 'Carlos López', fecha: '2024-01-13', estado: 'Pendiente', total: 3200 }
          ];
          this.cargandoPedidos = false;
        }
      }
    });
  }

  cargarProductosPopulares() {
    this.cargandoProductos = true;
    this.errorProductos = null;

    this.dashboardService.getProductosPopulares().subscribe({
      next: (data) => {
        this.productosPopulares = data.slice(0, 5); // Solo los 5 más populares
        this.cargandoProductos = false;
        console.log('✅ Productos populares cargados:', data.length);
      },
      error: (error) => {
        console.error('❌ Error cargando productos populares:', error);
        this.errorProductos = 'No se pudieron cargar los productos populares';
        this.cargandoProductos = false;

        // Datos de ejemplo para desarrollo
        if (error.status === 0 || error.status === 404) {
          this.productosPopulares = [
            { idProducto: 1, nombre: 'Maíz Premium', categoria: 'Granos', cantidadVendida: 150, totalVentas: 45000 },
            { idProducto: 2, nombre: 'Fertilizante Orgánico', categoria: 'Insumos', cantidadVendida: 85, totalVentas: 25500 },
            { idProducto: 3, nombre: 'Semillas de Soya', categoria: 'Semillas', cantidadVendida: 120, totalVentas: 36000 }
          ];
          this.cargandoProductos = false;
        }
      }
    });
  }

  cargarVentasMensuales() {
    this.cargandoVentas = true;
    this.errorVentas = null;

    this.dashboardService.getVentasMensuales().subscribe({
      next: (data) => {
        this.ventasMensuales = data.slice(0, 6); // Últimos 6 meses
        this.cargandoVentas = false;
        console.log('✅ Ventas mensuales cargadas:', data.length);
      },
      error: (error) => {
        console.error('❌ Error cargando ventas mensuales:', error);
        this.errorVentas = 'No se pudieron cargar las ventas mensuales';
        this.cargandoVentas = false;

        // Datos de ejemplo para desarrollo
        if (error.status === 0 || error.status === 404) {
          const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
          this.ventasMensuales = meses.map((mes, index) => ({
            mes: mes,
            anio: 2024,
            totalVentas: Math.floor(Math.random() * 50000) + 20000,
            cantidadPedidos: Math.floor(Math.random() * 30) + 10
          }));
          this.cargandoVentas = false;
        }
      }
    });
  }

  // Métodos auxiliares para la vista
  formatoMoneda(valor: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(valor || 0);
  }

  formatoNumero(valor: number): string {
    return valor?.toLocaleString('es-MX') || '0';
  }

  formatoFecha(fecha: string): string {
    if (!fecha) return '';
    return new Date(fecha).toLocaleDateString('es-MX');
  }

  getColorEstado(estado: string): string {
    switch(estado?.toLowerCase()) {
      case 'completado': return 'bg-green-100 text-green-800';
      case 'en proceso': return 'bg-yellow-100 text-yellow-800';
      case 'pendiente': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  // Navegación
  navegarAPedidos() {
    this.router.navigate(['/pedidos']);
  }

  navegarAProductos() {
    this.router.navigate(['/productos']);
  }

  navegarAPagos() {
    this.router.navigate(['/pagos']);
  }

  navegarAProveedores() {
    this.router.navigate(['/proveedores']);
  }

  // Recargar datos
  recargarDashboard() {
    this.cargarTodosLosDatos();
  }
}
