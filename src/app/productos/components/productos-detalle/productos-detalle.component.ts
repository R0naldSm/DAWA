import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductoService } from '../../../services/productoService';
import { CommonModule } from '@angular/common';
import { Producto } from '../../../interfaces/productos';

@Component({
  selector: 'app-productos-detalle',
  imports: [CommonModule],
  templateUrl: './productos-detalle.component.html',
})
export default class ProductosDetalleComponent {
  private ruta = inject(ActivatedRoute);
  private router = inject(Router);
  private productoService = inject(ProductoService);

  producto: Producto | null = null;
  error: string | null = null;

  ngOnInit() {
    this.ruta.params.subscribe(params => {
      const id = Number(params['id']);
      if (!isNaN(id)) {
        this.error = null;
        this.productoService.getById(id).subscribe({
          next: (p) => (this.producto = p),
          error: (err) => {
            // eslint-disable-next-line no-console
            console.error(err);
            this.error = 'No se pudo cargar el producto.';
            this.producto = null;
          },
        });
      }
    });
  }

  volver() {
    this.router.navigate(['/productos']);
  }
}
