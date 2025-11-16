import { Component, inject } from '@angular/core';
import { Pedido } from '../../../interfaces/pedido';
import { TablaPedidos } from "../tabla-pedidos/tabla-pedidos";
import { PedidoService } from '../../../services/pedidoService';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Paginacion } from '../paginacion/paginacion';

@Component({
  selector: 'app-lista-pedidos',
  imports: [TablaPedidos, ReactiveFormsModule, Paginacion],
  templateUrl: './lista-pedidos.html',
  styleUrl: './lista-pedidos.css',
})
export default class ListaPedidos {
  // servicios 
  private pedidoService = inject(PedidoService)
  // ruta activa
  private rutaActiva = inject(ActivatedRoute)
  // formulario
  private form = inject(NonNullableFormBuilder)

  pagina: number = 1;
  ngOnInit() {
    this.rutaActiva.params.subscribe(params => {
      this.pagina = parseInt(params['pagina']) || 1;
    });
  }

  formBusqueda = this.form.group({
    nombre_proveedor: ['']
  });

  listaPedidos(page: number): Pedido[] {
    let pedidos =  this.pedidoService.PedidoByProveedor(this.formBusqueda.value.nombre_proveedor || '')

    let inicio = (page - 1) * 5
    let pedidosPaginados = pedidos.slice(inicio, inicio + 5)

    return pedidosPaginados
  }

  totalPaginas(): number {
    let pedidos =  this.pedidoService.PedidoByProveedor(this.formBusqueda.value.nombre_proveedor || '')
    return Math.ceil(pedidos.length / 5)
  }


}
