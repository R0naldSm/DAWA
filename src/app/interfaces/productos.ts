export interface Producto {
  id_proveedor: number;
  nombreProducto: string;
  descripcion: string;
  unidadMedida: string;
  precio: number;
  disponibilidad: boolean;
}