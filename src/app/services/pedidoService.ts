import { Injectable } from '@angular/core';
import { Pedido } from '../interfaces/pedido';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PedidoService {
  private pedidos: Pedido[] = [
    {
      id_pedido: 1,
      nombre_proveedor: "Tech Solutions S.A.",
      fecha_creacion_pedido: "2025-11-01",
      fecha_estimada_entrega: "2025-11-07",
      estado: "Entregado",
      total: 1900.00,
      observaciones: "Compra de equipos de oficina"
    },
    {
      id_pedido: 2,
      nombre_proveedor: "AgroAndes Cía. Ltda.",
      fecha_creacion_pedido: "2025-11-05",
      fecha_estimada_entrega: "2025-11-12",
      estado: "Pendiente",
      total: 114.00,
      observaciones: "Fertilizantes para cultivo de pruebas"
    },
    {
      id_pedido: 3,
      nombre_proveedor: "Construec S.A.",
      fecha_creacion_pedido: "2025-11-02",
      fecha_estimada_entrega: "2025-11-09",
      estado: "En proceso",
      total: 390.00,
      observaciones: "Materiales de construcción para almacén"
    },
    {
      id_pedido: 4,
      nombre_proveedor: "Medicorps S.A.",
      fecha_creacion_pedido: "2025-11-08",
      fecha_estimada_entrega: "2025-11-15",
      estado: "Cancelado",
      total: 38.70,
      observaciones: "Pedido cancelado por falta de stock",
    },
    {
      id_pedido: 5,
      nombre_proveedor: "GlobalNet S.A.",
      fecha_creacion_pedido: "2025-11-03",
      fecha_estimada_entrega: "2025-11-10",
      estado: "Entregado",
      total: 96.00,
      observaciones: "Routers para oficinas regionales",
    },
    {
      id_pedido: 6,
      nombre_proveedor: "CompuStore S.A.",
      fecha_creacion_pedido: "2025-11-04",
      fecha_estimada_entrega: "2025-11-11",
      estado: "En proceso",
      total: 74.97,
      observaciones: "Pedido de periféricos para nuevos equipos",
    }
  ];

  PedidoByProveedor(nombre_proveedor: string): Pedido[] {
    return this.pedidos.filter(
      pedido => pedido.nombre_proveedor.toLowerCase().includes(nombre_proveedor.toLowerCase())
    );
  }

}
