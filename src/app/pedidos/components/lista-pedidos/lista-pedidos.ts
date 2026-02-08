import { Component, inject, OnInit } from '@angular/core';
import { Pedido } from '../../../interfaces/pedido';
import { TablaPedidos } from "../tabla-pedidos/tabla-pedidos";
import { PedidoService } from '../../../services/pedidoService';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-lista-pedidos',
  imports: [TablaPedidos, ReactiveFormsModule, RouterLink],
  templateUrl: './lista-pedidos.html',
  styleUrl: './lista-pedidos.css',
})
export class ListaPedidos implements OnInit {
  private pedidoService = inject(PedidoService);
  private form = inject(NonNullableFormBuilder);


  todosLosPedidos: Pedido[] = [];

  formBusqueda = this.form.group({
    nombre_proveedor: ['']
  });

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.pedidoService.ObtenerPedidos().subscribe({
      next: (respuesta) => {
        this.todosLosPedidos = respuesta.data.map((p: any) => ({
          id_pedido: p.idPedido,
          nombre_proveedor: p.proveedorNombre,
          fecha_creacion_pedido: new Date(p.fechaPedido).toLocaleDateString('es-ES', {year: 'numeric', month: '2-digit', day: '2-digit'}),
          fecha_estimada_entrega: new Date(p.fechaEntregaEstimada).toLocaleDateString('es-ES', {year: 'numeric', month: '2-digit', day: '2-digit'}),
          estado: p.estado,
          total: p.total,
          observaciones: ''
        }));
      },
      error: (e) => console.error('Error cargando pedidos', e)
    });

  }

  listaPedidos(): Pedido[] {
    const nombreProveedor = this.formBusqueda.get('nombre_proveedor')?.value.toLowerCase() || '';
    return this.todosLosPedidos.filter(p => p.nombre_proveedor.toLowerCase().includes(nombreProveedor));
  }

}
