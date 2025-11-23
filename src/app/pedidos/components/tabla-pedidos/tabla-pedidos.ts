import { Component, inject, input } from '@angular/core';
import { Pedido } from '../../../interfaces/pedido';
import { Proveedor } from '../../../interfaces/proveedor';
import { DetallePedido } from '../../../interfaces/detallePedido';
import { ProveedorService } from '../../../services/proveedorService';
import { PedidoService } from '../../../services/pedidoService';
import { TablaDetallePedidos } from "../tabla-detalle-pedidos/tabla-detalle-pedidos";
import { InfoPedido } from "../info-pedido/info-pedido";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-tabla-pedidos',
  imports: [InfoPedido, RouterLink],
  templateUrl: './tabla-pedidos.html',
  styleUrl: './tabla-pedidos.css',
})
export class TablaPedidos {
  pedidos = input.required<Pedido[]>()
  proveedorService = inject(ProveedorService)
  pedidoService = inject(PedidoService)

  //info del pedido seleccionado
  pedidoSeleccionado: Pedido | null = null;
  infoProveedor: Proveedor | null | undefined = null;
  productosPedidos: DetallePedido[] = [];


  seleccionarPedido(pedido: Pedido) {
    this.pedidoSeleccionado = pedido;
    this.infoProveedor = this.proveedorService.getProveedorByNombre(pedido.nombre_proveedor)
    this.productosPedidos = this.pedidoService.getDetallesByPedido(pedido.id_pedido)
  }

  reactivar(idPedido: number){
    this.pedidoService.ReactivarPedido(idPedido)
  }

  enviar(){
    alert("Pedido enviado")
  }
}
