import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PagosService, Pago, ResumenPagos } from './../../services/pagosService';
import { AuthService } from './../../services/auth';
import { ProveedorService } from './../../services/proveedorService';


@Component({
  selector: 'app-pagos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pagos.html',
  styleUrls: ['./pagos.css']
})
export class PagosComponent implements OnInit {
  // Datos para la tabla
  pagos: Pago[] = [];
  pagosFiltrados: Pago[] = [];
  
  // Filtros
  filtroEstado: string = '';
  busqueda: string = '';
  
  // Resumen
  resumen: ResumenPagos = {
    totalPagado: 0,
    pendiente: 0,
    vencido: 0,
    total: 0
  };
  
  // Estados para el filtro
  estados = [
    { valor: '', texto: 'Todos los estados' },
    { valor: 'Pagado', texto: 'Pagado' },
    { valor: 'Pendiente', texto: 'Pendiente' },
    { valor: 'Vencido', texto: 'Vencido' }
  ];
  
  // Loading
  cargando: boolean = false;
  errorCarga: string | null = null;
  
  // Usuario autenticado
  usuario: any = null;
  
  constructor(
    private pagosService: PagosService,
    private authService: AuthService
  ) { }
  
  ngOnInit(): void {
    // Verificar autenticación
    this.usuario = this.authService.getCurrentUser();
    if (!this.usuario) {
      this.errorCarga = 'No estás autenticado';
      return;
    }
    
    this.cargarDatos();
  }
  
  cargarDatos(): void {
    this.cargarPagos();
    this.cargarResumen();
  }
  
  cargarPagos(): void {
    this.cargando = true;
    this.errorCarga = null;
    
    this.pagosService.getPagos(this.filtroEstado, this.busqueda)
      .subscribe({
        next: (data) => {
          this.pagos = data;
          this.pagosFiltrados = data;
          this.cargando = false;
          console.log('Pagos cargados:', data.length);
        },
        error: (error) => {
          console.error('Error al cargar pagos:', error);
          this.errorCarga = 'Error al cargar los pagos. Verifica la conexión.';
          this.cargando = false;
        }
      });
  }
  
  cargarResumen(): void {
    this.pagosService.getResumenPagos()
      .subscribe({
        next: (data) => {
          this.resumen = data;
        },
        error: (error) => {
          console.error('Error al cargar resumen:', error);
        }
      });
  }
  
  aplicarFiltros(): void {
    console.log('Aplicando filtros:', {
      estado: this.filtroEstado,
      busqueda: this.busqueda
    });
    this.cargarPagos();
  }
  
  limpiarFiltros(): void {
    this.filtroEstado = '';
    this.busqueda = '';
    this.cargarPagos();
  }
  
  // Acciones
  verDetalle(pago: Pago): void {
    console.log('Ver detalle:', pago);
    // Aquí puedes implementar un modal o navegación
  }
  
  editarPago(pago: Pago): void {
    console.log('Editar pago:', pago);
    // Implementar lógica de edición (modal o nueva ruta)
  }
  
  eliminarPago(id?: number): void {
    if (!id) return;
    if (confirm('¿Estás seguro de eliminar este pago?')) {
      this.pagosService.eliminarPago(id)
        .subscribe({
          next: () => {
            alert('Pago eliminado correctamente');
            this.cargarDatos();
          },
          error: (error) => {
            console.error('Error al eliminar pago:', error);
            alert('Error al eliminar el pago');
          }
        });
    }
  }
  
  marcarComoPagado(pagoOrId: any): void {
    const id = typeof pagoOrId === 'number' ? pagoOrId : (pagoOrId.idPago || pagoOrId.id);
    if (!id) return;

    this.pagosService.marcarComoPagado(id)
      .subscribe({
        next: () => {
          alert('Pago marcado como pagado');
          this.cargarDatos();
        },
        error: (error) => {
          console.error('Error al marcar como pagado:', error);
          alert('Error al actualizar el estado');
        }
      });
  }

  // Modal / crear pago
  mostrarModal: boolean = false;
  nuevoPago: any = {
    proveedor: '',
    concepto: '',
    monto: 0,
    fecha: new Date().toISOString().split('T')[0],
    estado: 'Pendiente',
    metodoPago: '',
    numeroTransaccion: ''
  };

  abrirModal(): void {
    this.mostrarModal = true;
    this.nuevoPago = { proveedor: '', concepto: '', monto: 0, fecha: new Date().toISOString().split('T')[0], estado: 'Pendiente', metodoPago: '', numeroTransaccion: '' };
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }

  guardarPago(): void {
    const payload: Pago = {
      idProveedor: 0,
      monto: Number(this.nuevoPago.monto) || 0,
      fecha: this.nuevoPago.fecha,
      estado: this.nuevoPago.estado,
      concepto: this.nuevoPago.concepto,
      metodoPago: this.nuevoPago.metodoPago || '',
      numeroTransaccion: this.nuevoPago.numeroTransaccion || ''
    } as Pago;

    this.pagosService.crearPago(payload).subscribe({
      next: () => {
        alert('Pago creado correctamente');
        this.cargarDatos();
        this.cerrarModal();
      },
      error: (err) => {
        console.error('Error creando pago:', err);
        alert('Error creando pago');
      }
    });
  }
  
  // Formatear moneda
  formatoMoneda(valor: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(valor);
  }
  
  // Formatear fecha
  formatoFecha(fecha: string): string {
    if (!fecha) return 'N/A';
    try {
      const date = new Date(fecha);
      return date.toLocaleDateString('es-MX');
    } catch {
      return fecha;
    }
  }
  
  // Obtener clase CSS para el estado
  getClaseEstado(estado: string): string {
    switch(estado?.toLowerCase()) {
      case 'pagado': return 'estado-pagado';
      case 'pendiente': return 'estado-pendiente';
      case 'vencido': return 'estado-vencido';
      default: return 'estado-default';
    }
  }

  // Compatibilidad con la plantilla (nombre usado en HTML)
  getEstadoClass(estado: string): string { return this.getClaseEstado(estado); }

  // Totales y utilidades usadas por la plantilla
  getTotalPorEstado(estado: string): number {
    return this.pagos.reduce((sum, p) => sum + ((p.estado === estado) ? p.monto : 0), 0);
  }

  getTotalPagos(): number {
    return this.pagos.reduce((sum, p) => sum + p.monto, 0);
  }
}