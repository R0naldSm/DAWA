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
  infoProveedor: Proveedor | null | undefined = null;
  productosPedidos: DetallePedido[] = [];

  seleccionarPedido(pedido: Pedido) {
    this.pedidoSeleccionado = pedido;

    this.proveedorService.getProveedorByNombre(pedido.nombre_proveedor).subscribe({
      next: (provs) => {
        this.infoProveedor = provs.length > 0 ? provs[0] : null;
      },
      error: (e) => console.error(e)
    });

    this.pedidoService.getDetallesByPedido(pedido.id_pedido).subscribe({
      next: (detalles) => {
        this.productosPedidos = detalles;
      },
      error: (e) => console.error('Error cargando detalles', e)
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
