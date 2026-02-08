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
  listaProveedores = input.required<any[]>()
  // emitir id del proveedor seleccionado
  proveedorSeleccionado = output<number>()
  // estado de la lista (mostrar/ocultar)
  visibleLista = false;

  //filtrar proveedores según el nombre ingresado
  datosFiltrados(): any[] {
    const proveedor = this.formSelectorProveedor.get('nombreProveedor')!.value.toLowerCase()
    return this.listaProveedores().filter(p => p.nombre.toLowerCase().includes(proveedor))
  }

  //seleccionar proveedor de la lista
  datoSeleccionado(proveedor: any) {
    this.formSelectorProveedor.get('nombreProveedor')!.setValue(proveedor.nombre)
    this.visibleLista = false
    this.proveedorSeleccionado.emit(proveedor.id)
  }
}
