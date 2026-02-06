import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { AuthService } from './auth';
import { Pedido } from '../interfaces/pedido';
import { DetallePedido } from '../interfaces/detallePedido';

@Injectable({
  providedIn: 'root',
})
export class PedidoService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private apiUrl = 'http://localhost:5000/api/Pedidos';

  private getHeaders() {
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.auth.getToken()}`,
        'Content-Type': 'application/json'
      })
    };
  }

  PedidoByProveedor(nombre_proveedor: string = ''): Observable<Pedido[]> {
    const body = {
      Transaccion: 'OBTENER_TODOS',
      ProveedorNombre: nombre_proveedor,
      Pagina: 1,
      RegistrosPorPagina: 100
    };

    return this.http.post<any>(`${this.apiUrl}/GetPedidos`, body, this.getHeaders()).pipe(
      map(response => {
        return response.data.map((p: any) => ({
          id_pedido: p.IdPedido,
          nombre_proveedor: p.ProveedorNombre,
          fecha_creacion_pedido: p.FechaPedido, // Ojo con el formato de fecha
          fecha_estimada_entrega: p.FechaEntregaEstimada,
          estado: p.Estado,
          total: p.Total,
          observaciones: p.Observaciones || ''
        }));
      })
    );
  }

  getDetallesByPedido(id_pedido: number): Observable<DetallePedido[]> {
    const body = {
      Transaccion: 'OBTENER_POR_ID',
      IdPedido: id_pedido
    };

    return this.http.post<any>(`${this.apiUrl}/GetPedidos`, body, this.getHeaders()).pipe(
      map(response => {
        const detalles = response.data.Detalles || [];

        return detalles.map((d: any) => ({
          idDetalle: d.IdDetalle,
          idPedido: d.IdProducto,
          producto: d.NombreProducto,
          cantidad: d.Cantidad,
          precioUnitario: d.PrecioUnitario,
          total: d.Subtotal
        }));
      })
    );
  }

  ReactivarPedido(idPedido: number): Observable<any> {
    const body = {
      Transaccion: 'EDITAR_ESTADO',
      IdPedido: idPedido,
      Estado: 'Pendiente'
    };
    return this.http.post(`${this.apiUrl}/GestionarPedido`, body, this.getHeaders());
  }
}
