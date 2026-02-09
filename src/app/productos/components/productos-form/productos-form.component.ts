import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductoService } from '../../../services/productoService';
import { ProveedorService } from '../../../services/proveedorService';
import { Producto } from '../../../interfaces/productos';
import { Proveedor } from '../../../interfaces/proveedor';

@Component({
  selector: 'app-productos-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './productos-form.component.html',
})
export default class ProductosFormComponent {
  private rutaActiva = inject(ActivatedRoute);
  private router = inject(Router);
  private productoService = inject(ProductoService);
  private proveedorService = inject(ProveedorService);
  private fb = inject(NonNullableFormBuilder);

  productoId?: number;
  guardando = false;
  error: string | null = null;
  proveedores: Proveedor[] = [];

  form = this.fb.group({
    proveedorId: [0, [Validators.required, Validators.min(1)]],
    nombre: ['', Validators.required],
    descripcion: [''],
    unidadMedida: [''],
    precio: [0, [Validators.required, Validators.min(0)]],
    disponible: [true],
  });

  ngOnInit() {
    // Cargar proveedores disponibles
    this.proveedorService.cargarProveedores().subscribe({
      next: (data) => (this.proveedores = data),
      error: (err) => {
        console.error(err);
        this.error = 'No se pudieron cargar los proveedores.';
      },
    });

    // Si hay ID, cargar el producto
    this.rutaActiva.params.subscribe(params => {
      if (params['id']) {
        this.productoId = Number(params['id']);
        this.productoService.getById(this.productoId).subscribe({
          next: (p) => {
            if (!p) return;
            this.form.patchValue({
              proveedorId: p.proveedorId,
              nombre: p.nombre,
              descripcion: p.descripcion || '',
              unidadMedida: p.unidadMedida || '',
              precio: p.precio || 0,
              disponible: p.disponible,
            });
          },
          error: (err) => {
            console.error(err);
            this.error = 'No se pudo cargar el producto.';
          },
        });
      }
    });
  }

  cancelar() {
    this.router.navigate(['/productos']);
  }

  guardar() {
    if (this.form.invalid) {
      this.error = 'Complete todos los campos requeridos.';
      return;
    }

    this.guardando = true;
    this.error = null;
    const v = this.form.getRawValue();

    // Construir payload con todos los valores sin conversiones a undefined
    const payload: Producto = {
      id: this.productoId,
      proveedorId: Number(v.proveedorId ?? 0),
      nombre: String(v.nombre ?? '').trim(),
      descripcion: String(v.descripcion ?? '').trim(), // Enviar como string, no undefined
      unidadMedida: String(v.unidadMedida ?? '').trim(), // Enviar como string, no undefined
      precio: Number(v.precio ?? 0),
      disponible: Boolean(v.disponible ?? true),
      estado: 'A',
    };

    const request$ = this.productoId
      ? this.productoService.update(payload)
      : this.productoService.create(payload);

    request$.subscribe({
      next: () => {
        this.guardando = false;
        this.router.navigate(['/productos']);
      },
      error: (err) => {
        console.error(err);
        this.guardando = false;
        const backendMsg =
          err?.error?.error ??
          err?.error?.mensaje ??
          err?.error?.message ??
          (typeof err?.error === 'string' ? err.error : null) ??
          err?.message ??
          null;
        this.error = backendMsg ? String(backendMsg) : 'No se pudo guardar el producto.';
      },
    });
  }
}


