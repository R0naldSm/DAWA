import { Component, inject, OnInit } from '@angular/core';
import { Pedido } from '../../../interfaces/pedido';
import { TablaPedidos } from "../tabla-pedidos/tabla-pedidos";
import { PedidoService } from '../../../services/pedidoService';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Paginacion } from '../paginacion/paginacion';

@Component({
  selector: 'app-lista-pedidos',
  imports: [TablaPedidos, ReactiveFormsModule, Paginacion, RouterLink],
  templateUrl: './lista-pedidos.html',
  styleUrl: './lista-pedidos.css',
})
export class ListaPedidos implements OnInit {
  private pedidoService = inject(PedidoService);
  private rutaActiva = inject(ActivatedRoute);
  private router = inject(Router);
  private form = inject(NonNullableFormBuilder);

  pagina: number = 1;

  todosLosPedidos: Pedido[] = [];

  formBusqueda = this.form.group({
    nombre_proveedor: ['']
  });

  ngOnInit() {
    this.rutaActiva.params.subscribe(params => {
      this.pagina = parseInt(params['pagina']) || 1;
    });

    this.formBusqueda.get('nombre_proveedor')?.valueChanges.subscribe(() => {
      this.cargarDatos();
      this.router.navigate(['/pedidos', 1]);
    });

    this.cargarDatos();
  }

  cargarDatos() {
    const busqueda = this.formBusqueda.value.nombre_proveedor || '';

    this.pedidoService.PedidoByProveedor(busqueda).subscribe({
      next: (data) => {
        this.todosLosPedidos = data;
      },
      error: (e) => console.error('Error cargando pedidos', e)
    });
  }

  listaPedidos(page: number): Pedido[] {
    let inicio = (page - 1) * 5;
    return this.todosLosPedidos.slice(inicio, inicio + 5);
  }

  totalPaginas(): number {
    return Math.ceil(this.todosLosPedidos.length / 5);
  }
}
