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

  ObtenerPedidos(): Observable<any> {
    const body = {
      "transaccion": "OBTENER_TODOS"
    };

    return this.http.post<any>(`${this.apiUrl}/GetPedidos`, body, this.getHeaders())
  }

  getDetallesByPedido(id_pedido: number): Observable<any> {
    const body = {
      transaccion: 'OBTENER_POR_ID',
      idPedido: id_pedido
    };

    return this.http.post<any>(`${this.apiUrl}/GetPedidos`, body, this.getHeaders())
  }

  ReactivarPedido(idPedido: number): Observable<any> {
    const body = {
      Transaccion: 'EDITAR_ESTADO',
      IdPedido: idPedido,
      Estado: 'Pendiente'
    };
    return this.http.post(`${this.apiUrl}/GestionarPedido`, body, this.getHeaders());
  }

  crearPedido(pedido: any) {

    const datosBasicos = pedido.datosBasicos;
    const productos = pedido.productos;
    const detalles = productos.map((p: any) => ({
      IdProducto: parseInt(p.IdProducto) || parseInt(p.id),
      Cantidad: parseInt(p.Cantidad) || parseInt(p.cantidad),
      PrecioUnitario: parseFloat(p.PrecioUnitario) || parseFloat(p.precioUnitario)
    }));

    const body = {
      "Transaccion": "CREAR_PEDIDO",
      "IdProveedor": datosBasicos.proveedor,
      "Dia": datosBasicos.dia,
      "Mes": datosBasicos.mes,
      "Ano": datosBasicos.anio,
      "Observaciones": datosBasicos.observaciones || '',
      "Detalles": detalles
    }

    return this.http.post(`${this.apiUrl}/GestionarPedido`, body, this.getHeaders());
  }
}
