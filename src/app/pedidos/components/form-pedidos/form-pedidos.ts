import { Component, effect, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, ɵInternalFormsSharedModule } from '@angular/forms';
import { FormDatosBasicos } from "./form-datos-basicos/form-datos-basicos";
import { FormProductosPedidos } from "./form-productos-pedidos/form-productos-pedidos";
import { ActivatedRoute, Router } from '@angular/router';
import { IProductoPedido } from '../../../interfaces/IProductoPedido';
import { Pedido } from '../../../interfaces/pedido';
import { PedidoService } from '../../../services/pedidoService';

@Component({
  selector: 'app-nuevo-pedido',
  imports: [FormDatosBasicos, FormProductosPedidos, ɵInternalFormsSharedModule, ReactiveFormsModule],
  templateUrl: './form-pedidos.html',
  styleUrl: './form-pedidos.css',
})
export class NuevoPedido {
  
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
  pedidoService = inject(PedidoService);
  router = inject(Router);

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
    const pedidoFrom = this.formPedido.value;

    if (!pedidoFrom.datosBasicos?.proveedor || pedidoFrom.datosBasicos?.proveedor === 0) {
      alert('Debes seleccionar un proveedor');
      return;
    }

    // 2. Validar productos
    if (!pedidoFrom.productos || pedidoFrom.productos.length === 0) {
      alert('Debes agregar al menos un producto');
      return;
    }

    // 3. Validar fecha
    const dia = pedidoFrom.datosBasicos.dia;
    const mes = pedidoFrom.datosBasicos.mes;
    const anio = pedidoFrom.datosBasicos.anio;

    if (!dia || !mes || !anio) {
      alert('Debes seleccionar una fecha completa (día, mes, año)');
      return;
    }


    this.pedidoService.crearPedido(pedidoFrom).subscribe({
      next: (response) => {
        alert('Pedido creado exitosamente');
        console.log('Respuesta del servidor:', response);
        this.formPedido.reset();

        setTimeout(() => {
          this.router.navigate(['/pedidos']);
        }, 1000);
      },
      error: (error) => {
        alert('Error al crear el pedido: ' + error.message);
      }
    });
  }

  guardarIdProveedorSeleccionado(idProveedor: number) {
    this.datosBasicosForm.patchValue({
      proveedor: idProveedor
    });

    this.limpiarProductos();
  }

  guardarProductoPedido(producto: IProductoPedido) {
    const productosFormArray = this.formPedido.get('productos') as FormArray;

    if(producto.id === 0){
      return;
    }

    productosFormArray.push(this.fb.group({
      id: [producto.id],
      cantidad: [producto.cantidad],
      precioUnitario: [producto.precioUnitario]
    }));

    this.recalcularTotal();
  }

  eliminarProductoPedido(idProducto: number) {
    const productosFormArray = this.formPedido.get('productos') as FormArray;
    const indice = productosFormArray.controls.findIndex(control => control.get('id')?.value === idProducto);
    if (indice !== -1) {
      productosFormArray.removeAt(indice); 
    }
    this.recalcularTotal();
  }

  recalcularTotal() {
    const productosFormArray = this.formPedido.get('productos') as FormArray;
    let total = 0;

    productosFormArray.controls.forEach(control => {
      const cantidad = control.get('cantidad')?.value;
      const precioUnitario = control.get('precioUnitario')?.value;

      total += cantidad * precioUnitario;
    })

    this.formPedido.get('total')?.setValue(total);
  }

  limpiarProductos() {
    const productosFormArray = this.formPedido.get('productos') as FormArray;
    productosFormArray.clear();
  }
}