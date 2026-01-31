import { Component, effect, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, ɵInternalFormsSharedModule } from '@angular/forms';
import { FormDatosBasicos } from "./form-datos-basicos/form-datos-basicos";
import { FormProductosPedidos } from "./form-productos-pedidos/form-productos-pedidos";
import { ActivatedRoute, Router } from '@angular/router';
import { IProductoPedido } from '../../../interfaces/IProductoPedido';

@Component({
  selector: 'app-nuevo-pedido',
  imports: [FormDatosBasicos, FormProductosPedidos, ɵInternalFormsSharedModule, ReactiveFormsModule],
  templateUrl: './form-pedidos.html',
  styleUrl: './form-pedidos.css',
})
export default class NuevoPedido {

  constructor() {
    effect(() => {
      
    });
  }
  
  ngOnInit() {
    this.rutaActiva.params.subscribe(params => {
      if (params['id']) {
        this.titulo = 'Editar Pedido';
        this.textoBoton = 'Guardar Cambios';
      }
    });
  }

  // variables de clase (textos dinamicos)
  titulo: string = 'Crear Nuevo Pedido';
  textoBoton: string = 'Crear Pedido';

  // servicos e inyecciones
  rutaActiva = inject(ActivatedRoute)
  fb = inject(FormBuilder)

  // formulario
  formPedido = this.fb.group({
    
    datosBasicos: this.fb.group({
      proveedor: [0],
      dia: [''],
      mes: [''],
      anio: [''],
      observaciones: ['']
    }),
    productos: this.fb.array([]),
    
    total: [0]
  })


  get datosBasicosForm() {
    return this.formPedido.get('datosBasicos') as FormGroup;
  }

  get IdProveedorSeleccionado() {
    return this.datosBasicosForm.get('proveedor')?.value;
  }

  get TotalPedido() {
    return this.formPedido.get('total')?.value;
  }

  crearPedido() {
    console.log(this.formPedido.value);
  }

  guardarIdProveedorSeleccionado(idProveedor: number) {
    this.datosBasicosForm.patchValue({
      proveedor: idProveedor
    });
  }

  guardarProductoPedido(producto: IProductoPedido) {
    const productosFormArray = this.formPedido.get('productos') as FormArray;
    productosFormArray.push(this.fb.group({
      id: [producto.id],
      cantidad: [producto.cantidad]
    }));
  }

  eliminarProductoPedido(idProducto: number) {
    const productosFormArray = this.formPedido.get('productos') as FormArray;
    const indice = productosFormArray.controls.findIndex(control => control.get('id')?.value === idProducto);
    if (indice !== -1) {
      productosFormArray.removeAt(indice);
    }
  }
}