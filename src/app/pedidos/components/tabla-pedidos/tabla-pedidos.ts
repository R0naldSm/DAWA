import { Component, inject, input } from '@angular/core';
import { Pedido } from '../../../interfaces/pedido';
import { Proveedor } from '../../../interfaces/proveedor';
import { DetallePedido } from '../../../interfaces/detallePedido';
import { ProveedorService } from '../../../services/proveedorService';
import { PedidoService } from '../../../services/pedidoService';
import { InfoPedido } from "../info-pedido/info-pedido";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-tabla-pedidos',
  imports: [InfoPedido, RouterLink],
  templateUrl: './tabla-pedidos.html',
  styleUrl: './tabla-pedidos.css',
})
export class TablaPedidos {

  pedidos = input.required<Pedido[]>();

  proveedorService = inject(ProveedorService);
  pedidoService = inject(PedidoService);

  pedidoSeleccionado: Pedido | null = null;
  infoProveedor: any | null | undefined = null;
  productosPedidos: any[] = [];

  seleccionarPedido(pedido: Pedido) {
    this.pedidoSeleccionado = pedido;
    this.proveedorService.getProveedorByNombre(pedido.nombre_proveedor).subscribe({
      next: (respuesta) => {
        this.infoProveedor = respuesta[0];
      },
      error: (e) => console.error('Error cargando proveedor', e)
    });

    this.pedidoService.getDetallesByPedido(pedido.id_pedido).subscribe({
      next: (respuesta) => {
        this.productosPedidos = respuesta.data;
      },
      error: (e) => console.error('Error cargando detalles del pedido', e)
    });
  }

  reactivar(idPedido: number){
    this.pedidoService.ReactivarPedido(idPedido).subscribe({
      next: () => {
        alert("Pedido reactivado correctamente");
      },
      error: (e) => alert("Error al reactivar")
    });
  }

  enviar(){
    alert("Pedido enviado");
  }
}
