import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Pago {
  id: number;
  proveedor: string;
  monto: number;
  fecha: string;
  estado: 'Pendiente' | 'Pagado' | 'Vencido';
  concepto: string;
  metodoPago?: string;
}

@Component({
  selector: 'app-pagos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.css']
})
export class PagosComponent implements OnInit {
  pagos: Pago[] = [];
  pagosFiltrados: Pago[] = [];
  filtroEstado: string = 'Todos';
  busqueda: string = '';
  
  // Datos para nuevo pago
  nuevoPago: Pago = {
    id: 0,
    proveedor: '',
    monto: 0,
    fecha: '',
    estado: 'Pendiente',
    concepto: '',
    metodoPago: ''
  };
  
  mostrarModal: boolean = false;

  ngOnInit() {
    this.cargarPagos();
    this.aplicarFiltros();
  }

  cargarPagos() {
    // Datos quemados (mock data)
    this.pagos = [
      {
        id: 1,
        proveedor: 'AgroSemillas del Ecuador',
        monto: 2500.00,
        fecha: '2025-11-10',
        estado: 'Pagado',
        concepto: 'Compra de semillas de maíz',
        metodoPago: 'Transferencia'
      },
      {
        id: 2,
        proveedor: 'Fertilizantes La Costa',
        monto: 1800.50,
        fecha: '2025-11-15',
        estado: 'Pendiente',
        concepto: 'Fertilizantes orgánicos',
        metodoPago: ''
      },
      {
        id: 3,
        proveedor: 'Pesticidas Naturales SA',
        monto: 950.00,
        fecha: '2025-11-05',
        estado: 'Vencido',
        concepto: 'Productos fitosanitarios',
        metodoPago: ''
      },
      {
        id: 4,
        proveedor: 'Herramientas Agrícolas',
        monto: 3200.00,
        fecha: '2025-11-12',
        estado: 'Pagado',
        concepto: 'Equipos de riego',
        metodoPago: 'Cheque'
      },
      {
        id: 5,
        proveedor: 'AgroSemillas del Ecuador',
        monto: 1500.00,
        fecha: '2025-11-18',
        estado: 'Pendiente',
        concepto: 'Semillas de arroz',
        metodoPago: ''
      }
    ];
  }

  aplicarFiltros() {
    this.pagosFiltrados = this.pagos.filter(pago => {
      const cumpleFiltroEstado = this.filtroEstado === 'Todos' || pago.estado === this.filtroEstado;
      const cumpleBusqueda = pago.proveedor.toLowerCase().includes(this.busqueda.toLowerCase()) ||
                            pago.concepto.toLowerCase().includes(this.busqueda.toLowerCase());
      return cumpleFiltroEstado && cumpleBusqueda;
    });
  }

  getEstadoClass(estado: string): string {
    switch(estado) {
      case 'Pagado': return 'badge bg-success';
      case 'Pendiente': return 'badge bg-warning text-dark';
      case 'Vencido': return 'badge bg-danger';
      default: return 'badge bg-secondary';
    }
  }

  getTotalPagos(): number {
    return this.pagosFiltrados.reduce((sum, pago) => sum + pago.monto, 0);
  }

  getTotalPorEstado(estado: string): number {
    return this.pagos
      .filter(p => p.estado === estado)
      .reduce((sum, pago) => sum + pago.monto, 0);
  }

  abrirModal() {
    this.mostrarModal = true;
    this.nuevoPago = {
      id: this.pagos.length + 1,
      proveedor: '',
      monto: 0,
      fecha: '',
      estado: 'Pendiente',
      concepto: '',
      metodoPago: ''
    };
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  guardarPago() {
    if (this.nuevoPago.proveedor && this.nuevoPago.monto > 0 && this.nuevoPago.fecha) {
      this.pagos.unshift({...this.nuevoPago});
      this.aplicarFiltros();
      this.cerrarModal();
    }
  }

  marcarComoPagado(pago: Pago) {
    pago.estado = 'Pagado';
    pago.metodoPago = 'Transferencia';
    this.aplicarFiltros();
  }

  eliminarPago(id: number) {
    if (confirm('¿Está seguro de eliminar este pago?')) {
      this.pagos = this.pagos.filter(p => p.id !== id);
      this.aplicarFiltros();
    }
  }
}
