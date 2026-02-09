import { Component, inject } from '@angular/core';
import { ProductoService } from '../../../services/productoService';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Producto } from '../../../interfaces/productos';

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

  cargando = false;
  error: string | null = null;

  private productosAll: Producto[] = [];
  private productosFiltrados: Producto[] = [];

  ngOnInit() {
    this.cargarProductos();
    this.formBusqueda.valueChanges.subscribe(() => {
      this.pagina = 1;
      this.aplicarFiltro();
    });
  }

  private cargarProductos() {
    this.cargando = true;
    this.error = null;
    this.productoService.getProductos().subscribe({
      next: (rows) => {
        this.productosAll = rows;
        this.aplicarFiltro();
        this.cargando = false;
      },
      error: (err) => {
        this.cargando = false;
        this.error = 'No se pudo cargar productos.';
        // eslint-disable-next-line no-console
        console.error(err);
      },
    });
  }

  private aplicarFiltro() {
    const proveedor = (this.formBusqueda.value.proveedor || '').trim();
    if (proveedor === '') {
      this.productosFiltrados = this.productosAll;
      return;
    }

    const id = Number(proveedor);
    if (!isNaN(id) && id > 0) {
      this.productosFiltrados = this.productosAll.filter((p) => p.proveedorId === id);
      return;
    }

    const q = proveedor.toLowerCase();
    this.productosFiltrados = this.productosAll.filter((p) => (p.nombre || '').toLowerCase().includes(q));
  }

  listaProductos(page: number): Producto[] {
    const inicio = (page - 1) * 10;
    return this.productosFiltrados.slice(inicio, inicio + 10);
  }

  // method used by the template `@for` loop in other components
  productos(): Producto[] {
    return this.productosFiltrados;
  }

  totalPaginas(): number {
    return Math.max(1, Math.ceil(this.productosFiltrados.length / 10));
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

    const producto = this.productosAll.find((p) => p.id === id);
    if (!producto) {
      alert('Producto no encontrado.');
      return;
    }

    // Para eliminar, enviamos con estado 'I'
    const productoEliminar = { ...producto, estado: 'I' };

    this.productoService.delete(productoEliminar).subscribe({
      next: () => {
        // Filtrar el producto de la lista en memoria
        this.productosAll = this.productosAll.filter((p) => p.id !== id);
        this.aplicarFiltro();
        alert('Producto eliminado exitosamente.');
      },
      error: (err) => {
        console.error(err);
        const backendMsg =
          err?.error?.error ??
          err?.error?.mensaje ??
          err?.error?.message ??
          (typeof err?.error === 'string' ? err.error : null) ??
          err?.message ??
          null;
        alert(backendMsg ? String(backendMsg) : 'No se pudo eliminar el producto.');
      },
    });
  }

  toggle(id?: number) {
    if (!id) return;
    const p = this.productosAll.find((x) => x.id === id);
    if (!p) return;

    const actualizado: Producto = {
      ...p,
      disponible: !p.disponible
    };

    this.productoService.update(actualizado).subscribe({
      next: () => {
        this.productosAll = this.productosAll.map((x) => (x.id === id ? actualizado : x));
        this.aplicarFiltro();
        alert(`Producto ${actualizado.disponible ? 'activado' : 'desactivado'} exitosamente.`);
      },
      error: (err) => {
        console.error(err);
        const backendMsg =
          err?.error?.error ??
          err?.error?.mensaje ??
          err?.error?.message ??
          (typeof err?.error === 'string' ? err.error : null) ??
          err?.message ??
          null;
        alert(backendMsg ? String(backendMsg) : 'No se pudo actualizar la disponibilidad.');
      },
    });
  }

  anterior() {
    this.pagina = Math.max(1, this.pagina - 1);
  }

  siguiente() {
    this.pagina = Math.min(this.totalPaginas(), this.pagina + 1);
  }

}
