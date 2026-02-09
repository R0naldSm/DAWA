import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth';

export interface EstadisticasDashboard {
  totalVentas?: number;
  totalPedidos?: number;
  totalClientes?: number;
  totalProductos?: number;
  ventasMensuales?: number;
  pedidosPendientes?: number;
  // Agrega más propiedades según lo que devuelva tu backend
}

export interface PedidoReciente {
  idPedido?: number;
  numeroPedido?: string;
  cliente?: string;
  fecha?: string;
  estado?: string;
  total?: number;
}

export interface ProductoPopular {
  idProducto?: number;
  nombre?: string;
  categoria?: string;
  cantidadVendida?: number;
  totalVentas?: number;
}

export interface VentaMensual {
  mes?: string;
  anio?: number;
  totalVentas?: number;
  cantidadPedidos?: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);

  private apiUrl = 'http://localhost:5000/api/Dashboard';

  private getHeaders() {
    const token = this.auth.getToken();
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    };
  }

  /**
   * Obtiene las estadísticas generales del dashboard
   * Endpoint: GET /api/Dashboard/estadisticas
   */
  getEstadisticas(): Observable<EstadisticasDashboard> {
    console.log('📊 Obteniendo estadísticas del dashboard...');
    
    return this.http.get<EstadisticasDashboard>(`${this.apiUrl}/estadisticas`, this.getHeaders())
      .pipe(
        // Mapear propiedades para consistencia (case insensitive)
        map((data: any) => this.normalizarEstadisticas(data))
      );
  }

  /**
   * Obtiene los pedidos recientes
   * Endpoint: GET /api/Dashboard/pedidos-recientes
   */
  getPedidosRecientes(): Observable<PedidoReciente[]> {
    console.log('📦 Obteniendo pedidos recientes...');
    
    return this.http.get<any[]>(`${this.apiUrl}/pedidos-recientes`, this.getHeaders())
      .pipe(
        map((data: any[]) => data.map(item => this.normalizarPedidoReciente(item)))
      );
  }

  /**
   * Obtiene los productos más populares
   * Endpoint: GET /api/Dashboard/productos-populares
   */
  getProductosPopulares(): Observable<ProductoPopular[]> {
    console.log('🏆 Obteniendo productos populares...');
    
    return this.http.get<any[]>(`${this.apiUrl}/productos-populares`, this.getHeaders())
      .pipe(
        map((data: any[]) => data.map(item => this.normalizarProductoPopular(item)))
      );
  }

  /**
   * Obtiene las ventas mensuales
   * Endpoint: GET /api/Dashboard/ventas-mensuales
   */
  getVentasMensuales(): Observable<VentaMensual[]> {
    console.log('📈 Obteniendo ventas mensuales...');
    
    return this.http.get<any[]>(`${this.apiUrl}/ventas-mensuales`, this.getHeaders())
      .pipe(
        map((data: any[]) => data.map(item => this.normalizarVentaMensual(item)))
      );
  }

  /**
   * Normaliza las estadísticas (manejo de diferentes formatos)
   */
  private normalizarEstadisticas(data: any): EstadisticasDashboard {
    return {
      totalVentas: data.totalVentas || data.TotalVentas || data.total_ventas || 0,
      totalPedidos: data.totalPedidos || data.TotalPedidos || data.total_pedidos || 0,
      totalClientes: data.totalClientes || data.TotalClientes || data.total_clientes || 0,
      totalProductos: data.totalProductos || data.TotalProductos || data.total_productos || 0,
      ventasMensuales: data.ventasMensuales || data.VentasMensuales || data.ventas_mensuales || 0,
      pedidosPendientes: data.pedidosPendientes || data.PedidosPendientes || data.pedidos_pendientes || 0
    };
  }

  /**
   * Normaliza un pedido reciente
   */
  private normalizarPedidoReciente(data: any): PedidoReciente {
    return {
      idPedido: data.idPedido || data.IdPedido || data.id || 0,
      numeroPedido: data.numeroPedido || data.NumeroPedido || data.numero || '',
      cliente: data.cliente || data.Cliente || data.nombreCliente || '',
      fecha: data.fecha || data.Fecha || data.fechaPedido || '',
      estado: data.estado || data.Estado || 'Pendiente',
      total: data.total || data.Total || data.monto || 0
    };
  }

  /**
   * Normaliza un producto popular
   */
  private normalizarProductoPopular(data: any): ProductoPopular {
    return {
      idProducto: data.idProducto || data.IdProducto || data.id || 0,
      nombre: data.nombre || data.Nombre || data.nombreProducto || '',
      categoria: data.categoria || data.Categoria || data.categoriaProducto || '',
      cantidadVendida: data.cantidadVendida || data.CantidadVendida || data.cantidad || 0,
      totalVentas: data.totalVentas || data.TotalVentas || data.ventas || 0
    };
  }

  /**
   * Normaliza una venta mensual
   */
  private normalizarVentaMensual(data: any): VentaMensual {
    return {
      mes: data.mes || data.Mes || data.nombreMes || '',
      anio: data.anio || data.Anio || data.año || 0,
      totalVentas: data.totalVentas || data.TotalVentas || data.ventas || 0,
      cantidadPedidos: data.cantidadPedidos || data.CantidadPedidos || data.pedidos || 0
    };
  }
}

// Necesitamos importar map desde rxjs/operators
import { map, catchError, tap } from 'rxjs/operators';