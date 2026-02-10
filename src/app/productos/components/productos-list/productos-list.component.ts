import { Component, inject } from '@angular/core';
import { ProductoService } from '../../../services/productoService';
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Producto } from '../../../interfaces/productos';

@Component({
  selector: 'app-productos-list',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './productos-list.component.html',
})
export default class ProductosList {
  private productoService = inject(ProductoService);
  private formBuilder = inject(NonNullableFormBuilder);
  private router = inject(Router);

  formBusqueda = this.formBuilder.group({
    proveedor: ['']
  });

  pagina: number = 1;
  verInactivos: boolean = false;

  cargando = false;
  error: string | null = null;

  private productosAll: Producto[] = [];
  private productosFiltrados: Producto[] = [];
  productosActivos: Producto[] = [];
  productosInactivos: Producto[] = [];

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

  // Llama al servicio. Si el backend ya filtra, no necesitas filtrar de nuevo en el front tan agresivamente
  this.productoService.getProductos(true).subscribe({
    next: (rows) => {
      this.productosAll = rows;
      this.aplicarFiltro(); // Esto actualizará las listas
      this.cargando = false;
    },
    error: (err) => {
      this.cargando = false;
      this.error = 'No se pudo cargar productos. Revisa la consola (F12).';
      console.error('Error de API:', err);
    },
  });
}

  private aplicarFiltro() {
    const proveedor = (this.formBusqueda.value.proveedor || '').trim();
    if (proveedor === '') {
      this.productosFiltrados = this.productosAll;
      this.actualizarSecciones();
      this.pagina = 1;
      return;
    }

    const id = Number(proveedor);
    if (!isNaN(id) && id > 0) {
      this.productosFiltrados = this.productosAll.filter((p) => p.proveedorId === id);
      this.actualizarSecciones();
      this.pagina = 1;
      return;
    }

    const q = proveedor.toLowerCase();
    this.productosFiltrados = this.productosAll.filter((p) => (p.nombre || '').toLowerCase().includes(q));
    this.actualizarSecciones();
    this.pagina = 1;
  }

  listaProductos(page: number): Producto[] {
    const inicio = (page - 1) * 10;
    return this.listaActual().slice(inicio, inicio + 10);
  }

  // method used by the template `@for` loop in other components
  productos(): Producto[] {
    return this.listaActual();
  }

  totalPaginas(): number {
    return Math.max(1, Math.ceil(this.listaActual().length / 10));
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
        this.productosAll = this.productosAll.map((p) => (p.id === id ? productoEliminar : p));
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

  activar(id?: number) {
    if (!id) return;
    const producto = this.productosAll.find((p) => p.id === id);
    if (!producto) {
      alert('Producto no encontrado.');
      return;
    }

    const productoActivar: Producto = { ...producto, estado: 'A' };

    this.productoService.update(productoActivar).subscribe({
      next: () => {
        this.productosAll = this.productosAll.map((p) => (p.id === id ? productoActivar : p));
        this.aplicarFiltro();
        alert('Producto activado exitosamente.');
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
        alert(backendMsg ? String(backendMsg) : 'No se pudo activar el producto.');
      },
    });
  }

  anterior() {
    this.pagina = Math.max(1, this.pagina - 1);
  }

  siguiente() {
    this.pagina = Math.min(this.totalPaginas(), this.pagina + 1);
  }

  toggleVista() {
    this.pagina = 1;
  }

  private listaActual(): Producto[] {
    return this.verInactivos ? this.productosInactivos : this.productosActivos;
  }

  private actualizarSecciones() {
    const esInactivo = (p: Producto) => (p.estado || '').toUpperCase() === 'I';
    this.productosInactivos = this.productosFiltrados.filter(esInactivo);
    this.productosActivos = this.productosFiltrados.filter((p) => !esInactivo(p));
  }

}
