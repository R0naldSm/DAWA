import { Component, input } from '@angular/core';
import { DetallePedido } from '../../../interfaces/detallePedido';

@Component({
  selector: 'app-tabla-detalle-pedidos',
  imports: [],
  templateUrl: './tabla-detalle-pedidos.html',
  styleUrl: './tabla-detalle-pedidos.css',
})
export class TablaDetallePedidos {
  detallePedido = input.required<DetallePedido[]>();
}
