import { Component, inject } from '@angular/core';
import { ProductoService } from '../../../services/productoService';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-productos-list',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './productos-list.component.html',
})
export default class ProductosListComponent {
  private productoService = inject(ProductoService);
  private formBuilder = inject(NonNullableFormBuilder);
  private router = inject(Router);

  formBusqueda = this.formBuilder.group({
    proveedor: ['']
  });

  pagina: number = 1;

  listaProductos(page: number): any[] {
    const proveedor = this.formBusqueda.value.proveedor || '';
    let productos = [] as any[];
    if (proveedor === '') {
      productos = this.productoService.getProductos();
    } else {
      // try numeric id first
      const id = Number(proveedor);
      if (!isNaN(id) && id > 0) {
        productos = this.productoService.getByProveedor(id);
      } else {
        // fallback: filter by supplier name (if available in proveedor fields)
        productos = this.productoService.getProductos().filter(p => (p.nombre || '').toLowerCase().includes(String(proveedor).toLowerCase()));
      }
    }

    const inicio = (page - 1) * 10;
    return productos.slice(inicio, inicio + 10);
  }

  // method used by the template `@for` loop in other components
  productos(): any[] {
    const proveedor = this.formBusqueda.value.proveedor || '';
    let productos = [] as any[];
    if (proveedor === '') {
      productos = this.productoService.getProductos();
    } else {
      const id = Number(proveedor);
      if (!isNaN(id) && id > 0) productos = this.productoService.getByProveedor(id);
      else productos = this.productoService.getProductos().filter(p => (p.nombre || '').toLowerCase().includes(String(proveedor).toLowerCase()));
    }
    return productos;
  }

  totalPaginas(): number {
    const proveedor = this.formBusqueda.value.proveedor || '';
    let productos = [] as any[];
    if (proveedor === '') productos = this.productoService.getProductos();
    else {
      const id = Number(proveedor);
      productos = (!isNaN(id) && id > 0) ? this.productoService.getByProveedor(id) : this.productoService.getProductos().filter(p => (p.nombre || '').toLowerCase().includes(String(proveedor).toLowerCase()));
    }
    return Math.max(1, Math.ceil(productos.length / 10));
  }

  irCrear() {
    this.router.navigate(['/productos/crear']);
  }

  editar(id?: number) {
    if (!id) return;
    this.router.navigate(['/productos', id, 'editar']);
  }

  eliminar(id?: number) {
    if (!id) return;
    if (!confirm('¿Eliminar producto? Esta acción no se puede deshacer.')) return;
    this.productoService.delete(id);
  }

  toggle(id?: number) {
    if (!id) return;
    this.productoService.toggleDisponibilidad(id);
  }

  anterior() {
    this.pagina = Math.max(1, this.pagina - 1);
  }

  siguiente() {
    this.pagina = Math.min(this.totalPaginas(), this.pagina + 1);
  }

}
