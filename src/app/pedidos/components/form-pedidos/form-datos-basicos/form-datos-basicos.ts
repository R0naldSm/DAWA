import { Component, effect, inject, input, output } from '@angular/core';
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

  private proveedorService = inject(ProveedorService);
  buscarTexto: string = '';
  verInactivos: boolean = false;

  constructor() {
    effect(() => {
      this.obtenerProveedores()
      const id = this.proveedorCargado();
      if (id) {
        this.proveedorSeleccionadoId = id;
      }
    });
  }

  ngOnInit() {
    
  }
  // servicio de proveedores
  servicioProveedores = inject(ProveedorService)
  // formulario reactivo (datos basicos)
  formDatosBasicos = input.required<FormGroup>()
  // proveedor seleccionado
  proveedorSeleccionado = output<number>()
  proveedorCargado = input<number>()
  // propiedades
  proveedores: any[] = []
  proveedorSeleccionadoId: number = 0;

  // metodo para obtener los nombres de los proveedores
  obtenerProveedores() {
    //this.proveedores = this.servicioProveedores.getProveedores()
    this.proveedorService.getProveedores(this.buscarTexto, this.verInactivos).subscribe({
      next: (data) => {
        this.proveedores = data.map((p: any) => ({
          id: p.IdProveedor || p.idProveedor,
          nombre: p.Nombre || p.nombre,
        }));
      },
      error: (e) => console.error('Error al cargar proveedores:', e)
    });
  }

  ProveedorSeleccionado(idProveedor: number) {
    this.proveedorSeleccionado.emit(idProveedor)
  }
}
