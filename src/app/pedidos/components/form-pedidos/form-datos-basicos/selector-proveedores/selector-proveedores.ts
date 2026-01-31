import { Component, inject, input, output } from '@angular/core';
import { FormGroup, FormsModule, NonNullableFormBuilder, ReactiveFormsModule } from "@angular/forms";
import { Proveedor } from '../../../../../interfaces/proveedor';

@Component({
  selector: 'app-selector-proveedores',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './selector-proveedores.html',
  styleUrl: './selector-proveedores.css',
})
export class SelectorProveedores {
  fb = inject(NonNullableFormBuilder)
  formSelectorProveedor = this.fb.group({
    nombreProveedor: ['']
  })

  // datos (nombres de proveedores)
  listaProveedores = input.required<Proveedor[]>()
  // emitir id del proveedor seleccionado
  proveedorSeleccionado = output<number>()
  // estado de la lista (mostrar/ocultar)
  visibleLista = false;

  // filtrar proveedores según el nombre ingresado
  datosFiltrados(): Proveedor[] {
    const proveedor = this.formSelectorProveedor.get('nombreProveedor')!.value.toLowerCase()
    return this.listaProveedores().filter(p => p.nombreEmpresa.toLowerCase().includes(proveedor))
  }

  // seleccionar proveedor de la lista
  datoSeleccionado(proveedor: Proveedor) {
    this.formSelectorProveedor.get('nombreProveedor')!.setValue(proveedor.nombreEmpresa)
    this.visibleLista = false
    this.proveedorSeleccionado.emit(proveedor.id)
  }
}
