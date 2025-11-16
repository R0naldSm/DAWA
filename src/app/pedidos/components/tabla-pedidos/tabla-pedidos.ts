import { Component, input } from '@angular/core';
import { Pedido } from '../../../interfaces/pedido';

@Component({
  selector: 'app-tabla-pedidos',
  imports: [],
  templateUrl: './tabla-pedidos.html',
  styleUrl: './tabla-pedidos.css',
})
export class TablaPedidos {
  pedidos = input.required<Pedido[]>()
}
