import { Component, effect, inject, input, output } from '@angular/core';
import { FormGroup, FormsModule, NonNullableFormBuilder, ReactiveFormsModule } from "@angular/forms";
import { Producto } from '../../../../../interfaces/productos';

@Component({
  selector: 'app-selector-productos',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './selector-productos.html',
  styleUrl: './selector-productos.css',
})
export class SelectorProductos {

  constructor() {
    effect(() => {
      if (this.resetearSelector()) {
        this.resetear()
      }
    })
  }

  // formulario reactivo
  fb = inject(NonNullableFormBuilder)
  formularioProducto = this.fb.group({
    nombreProducto: ['']
  })

  // datos a obtener y emitir
  productos = input.required<Producto[]>()
  idProductoSeleccionado = output<number>()
  resetearSelector = input<boolean>()

  // estado de la lista (mostrar/ocultar)
  visibleLista = false;

  // filtrar productos según el nombre ingresado
  datosFiltrados(): any[] {
    let nombreProducto = this.formularioProducto.get('nombreProducto')!.value.toLowerCase()
    return this.productos().filter(p => p.nombre.toLowerCase().includes(nombreProducto))
  }

  // seleccionar proveedor de la lista
  datoSeleccionado(dato: Producto) {
    this.formularioProducto.get('nombreProducto')!.setValue(dato.nombre)
    this.visibleLista = false
    this.idProductoSeleccionado.emit(dato.id ?? 0)
  }

  resetear() {
    this.formularioProducto.get('nombreProducto')!.setValue('')
  }
}
