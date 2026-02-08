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
        this.idPedidoAEditar = +params['id'];

        this.cargarDatosPedidoAEditar();
      }
    });
  }

  // variables de clase
  titulo: string = 'Crear Nuevo Pedido';
  idPedidoAEditar: number | null = null;
  proveedorCargado: number = 0;
  productosTabla: any[] = [];

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
    
    if(!this.validarDatos(pedidoFrom)){
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

  // metodos de edicion de pedido
  cargarDatosPedidoAEditar() {
    if (this.idPedidoAEditar) {
      this.pedidoService.getDetallesByPedido(this.idPedidoAEditar).subscribe({
        next: (respuesta) => {
          
          const pedido = respuesta.data;
          this.proveedorCargado = pedido.idProveedor;

          this.datosBasicosForm.patchValue({
            proveedor: pedido.idProveedor,
            dia: pedido.dia,
            mes: pedido.mes,
            anio: pedido.ano,
            observaciones: pedido.observaciones
          });

          this.formPedido.get('total')?.setValue(pedido.total);

          const productosFormArray = this.formPedido.get('productos') as FormArray;
          pedido.detalles.forEach((detalle: any) => {
            productosFormArray.push(this.fb.group({
              id: [detalle.idProducto],
              cantidad: [detalle.cantidad],
              precioUnitario: [detalle.precioUnitario]
            }));

            this.productosTabla.push({
              id: detalle.idProducto,
              cantidad: detalle.cantidad
            });
          });

        },
        error: (error) => {
          console.error('Error al cargar los detalles del pedido:', error);
        }
      });
    }
  }

  guardarCambiosEdicion() {
    const pedidoFrom = this.formPedido.value;

    if(!this.validarDatos(pedidoFrom)){
      return;
    }

    this.pedidoService.actualizarPedido(pedidoFrom, this.idPedidoAEditar!).subscribe({
      next: (response) => {
        alert('Pedido actualizado exitosamente');
        console.log('Respuesta del servidor:', response);
        this.formPedido.reset();

        setTimeout(() => {
          this.router.navigate(['/pedidos']);
        }, 1000);
      },
      error: (error) => {
        alert('Error al actualizar el pedido: ' + error.message);
      }
    });
  }

  validarDatos(pedidoFrom: any): boolean {
    if (!pedidoFrom.datosBasicos?.proveedor || pedidoFrom.datosBasicos?.proveedor === 0) {
      alert('Debes seleccionar un proveedor');
      return false;
    }

    // 2. Validar productos
    if (!pedidoFrom.productos || pedidoFrom.productos.length === 0) {
      alert('Debes agregar al menos un producto');
      return false;
    }

    // 3. Validar fecha
    const dia = pedidoFrom.datosBasicos.dia;
    const mes = pedidoFrom.datosBasicos.mes;
    const anio = pedidoFrom.datosBasicos.anio;

    if (!dia || !mes || !anio) {
      alert('Debes seleccionar una fecha completa (día, mes, año)');
      return false;
    }

    return true;
  }
}