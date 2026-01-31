import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductoService } from '../../../services/productoService';
import { Producto } from '../../../interfaces/productos';

@Component({
  selector: 'app-productos-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './productos-form.component.html',
})
export default class ProductosFormComponent {
  private rutaActiva = inject(ActivatedRoute);
  private router = inject(Router);
  private productoService = inject(ProductoService);
  private fb = inject(NonNullableFormBuilder);

  productoId?: number;

  form = this.fb.group({
    proveedorId: 0,
    nombre: [''],
    descripcion: [''],
    unidadMedida: [''],
    precio: 0,
    disponible: true,
  });

  ngOnInit() {
    this.rutaActiva.params.subscribe(params => {
      if (params['id']) {
        this.productoId = Number(params['id']);
        const p = this.productoService.getById(this.productoId);
        if (p) {
          this.form.patchValue({
            proveedorId: p.proveedorId || p.id_proveedor || 0,
            nombre: p.nombre || p.nombre || '',
            descripcion: p.descripcion || '',
            unidadMedida: p.unidadMedida || '',
            precio: p.precio || 0,
            disponible: p.disponible ?? p.disponibilidad ?? true,
          });
        }
      }
    });
  }

  cancelar() {
    this.router.navigate(['/productos']);
  }

  guardar() {
    const v = this.form.getRawValue();
    const payload: Producto = {
      id: this.productoId,
      proveedorId: Number(v.proveedorId ?? 0),
      id_proveedor: Number(v.proveedorId ?? 0),
      nombre: String(v.nombre ?? ''),
      descripcion: String(v.descripcion ?? ''),
      unidadMedida: String(v.unidadMedida ?? ''),
      precio: Number(v.precio ?? 0),
      disponible: Boolean(v.disponible ?? true),
      disponibilidad: Boolean(v.disponible ?? true),
    };

    if (this.productoId) {
      this.productoService.update(payload);
    } else {
      this.productoService.create(payload);
    }

    this.router.navigate(['/productos']);
  }

}
