import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductoService } from '../../../services/productoService';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-productos-detalle',
  imports: [CommonModule],
  templateUrl: './productos-detalle.component.html',
})
export class ProductosDetalle {
  private ruta = inject(ActivatedRoute);
  private router = inject(Router);
  private productoService = inject(ProductoService);

  producto: any = null;

  ngOnInit() {
    this.ruta.params.subscribe(params => {
      const id = Number(params['id']);
      if (!isNaN(id)) {
        this.producto = this.productoService.getById(id) || null;
      }
    });
  }

  volver() {
    this.router.navigate(['/productos']);
  }
}
