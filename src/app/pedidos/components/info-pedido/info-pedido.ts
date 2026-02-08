import { Component, input } from '@angular/core';
import { TablaDetallePedidos } from '../tabla-detalle-pedidos/tabla-detalle-pedidos';
import { Proveedor } from '../../../interfaces/proveedor';
import { Pedido } from '../../../interfaces/pedido';
import { DetallePedido } from '../../../interfaces/detallePedido';

@Component({
  selector: 'app-info-pedido',
  imports: [TablaDetallePedidos],
  templateUrl: './info-pedido.html',
  styleUrl: './info-pedido.css',
})
export class InfoPedido {
  infoProveedor = input<any | null>()
  pedidoSeleccionado = input<Pedido | null>()
  productosPedidos = input.required<any>()
}
