import { Component, inject, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule, ɵInternalFormsSharedModule } from '@angular/forms';
import { SelectorProveedores } from './selector-proveedores/selector-proveedores';
import { ProveedorService } from '../../../../services/proveedorService';
import { Proveedor } from '../../../../interfaces/proveedor';

@Component({
  selector: 'app-form-datos-basicos',
  imports: [ɵInternalFormsSharedModule, ReactiveFormsModule, SelectorProveedores],
  templateUrl: './form-datos-basicos.html',
  styleUrl: './form-datos-basicos.css',
})
export class FormDatosBasicos {

  ngOnInit() {
    this.obtenerProveedores()
  }
  // servicio de proveedores
  servicioProveedores = inject(ProveedorService)
  // formulario reactivo (datos basicos)
  formDatosBasicos = input.required<FormGroup>()
  // proveedor seleccionado
  proveedorSeleccionado = output<number>()
  // propiedades
  proveedores: Proveedor[] = []

  // metodo para obtener los nombres de los proveedores
  obtenerProveedores() {
    //this.proveedores = this.servicioProveedores.getProveedores()
  }

  ProveedorSeleccionado(idProveedor: number) {
    this.proveedorSeleccionado.emit(idProveedor)
  }
}
