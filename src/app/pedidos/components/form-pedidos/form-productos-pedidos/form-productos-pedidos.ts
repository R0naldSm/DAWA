import { Component, effect, inject, input, output } from '@angular/core';
import { SelectorProductos } from "./selector-productos/selector-productos";
import { ProductoService } from '../../../../services/productoService';
import { FormArray, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, ɵInternalFormsSharedModule } from '@angular/forms';
import { ProveedorService } from '../../../../services/proveedorService';
import { Producto } from '../../../../interfaces/productos';
import { IProductoPedido } from '../../../../interfaces/IProductoPedido';

@Component({
  selector: 'app-form-productos-pedidos',
  imports: [SelectorProductos, ɵInternalFormsSharedModule, ReactiveFormsModule],
  templateUrl: './form-productos-pedidos.html',
  styleUrl: './form-productos-pedidos.css',
})
export class FormProductosPedidos {

  constructor() {
    // Detectar cambios en el input
    effect(() => {
      const idProveedor = this.idProveedorSeleccionado();
      console.log('ID proveedor cambió:', idProveedor);
      this.obtenerProductosProveedor();
    });
  }

  // formulario reactivo
  fb = inject(NonNullableFormBuilder)
  formProducto = this.fb.group({
    id: [0],
    cantidad: [1]
  })

  // servicios
  servicioProveedor = inject(ProveedorService)
  servicioProductos = inject(ProductoService)

  // inputs y outputs
  idProveedorSeleccionado = input.required<number>()
  emitirProducto = output<IProductoPedido>()
  IdProductoEliminado = output<number>();

  // variables
  productos: Producto[] = []
  productosTabla: IProductoPedido[] = []
  TemporalProductos: IProductoPedido = { id: 0, cantidad: 0 }
  resetearSelectorProducto: boolean = false;
  
  

  // agregar al array de productos
  agregarProducto() {
    let producto: IProductoPedido = this.formProducto.getRawValue();
    if(this.productoEstaAgregado(producto.id)){
      return;
    }
    this.TemporalProductos = producto;

    this.agregarATabla(producto.id, producto.cantidad);

    this.formProducto.reset({ id: 0, cantidad: 1 });
    this.emitirProducto.emit(this.TemporalProductos);


    this.resetearSelectorProducto = true;
    setTimeout(() => {
      this.resetearSelectorProducto = false;
    }, 0);
  }

  obtenerProductosProveedor() {
    this.productos = this.servicioProductos.getByProveedor(this.idProveedorSeleccionado())
  }

  obtenerIdProductoSeleccionado(idProducto: number) {
    this.formProducto.get('id')!.setValue(idProducto);
  }

  agregarATabla(idProducto: number, cantidad: number) {

    if(this.productosTabla.find(p => p.id === idProducto)){
      return;
    }

    let producto = this.productos.find(p => p.id === idProducto);

    if (producto) {
      this.productosTabla.push({
        id: producto.id ?? 0,
        cantidad: cantidad,
        nombreProducto: producto.nombre,
        precioUnitario: producto.precio,
        subtotal: producto.precio * cantidad
      });
    }

  }

  productoEstaAgregado(idProducto: number): boolean {
    return this.productosTabla.some(p => p.id === idProducto);
  }

  removerProducto(idProducto: number) {
    this.productosTabla = this.productosTabla.filter(p => p.id !== idProducto);
    this.IdProductoEliminado.emit(idProducto);
  }
}
