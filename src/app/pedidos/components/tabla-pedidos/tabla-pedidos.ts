import { Component, inject, input } from '@angular/core';
import { Pedido } from '../../../interfaces/pedido';
import { Proveedor } from '../../../interfaces/proveedor';
import { Producto } from '../../../interfaces/productos';
import { ProveedorService } from '../../../services/proveedorService';

@Component({
  selector: 'app-tabla-pedidos',
  imports: [],
  templateUrl: './tabla-pedidos.html',
  styleUrl: './tabla-pedidos.css',
})
export class TablaPedidos {
  pedidos = input.required<Pedido[]>()
  proveedorService = inject(ProveedorService)

  //info del pedido seleccionado
  pedidoSeleccionado: Pedido | null = null;
  infoProveedor: Proveedor | null | undefined = null;
  productosPedidos: Producto[] = [];



  seleccionarPedido(pedido: Pedido) {
    this.pedidoSeleccionado = pedido;
    this.infoProveedor = this.proveedorService.getProveedorByNombre(pedido.nombre_proveedor)
  }
}
