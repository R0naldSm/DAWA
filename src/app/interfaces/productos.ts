export interface Producto {
  // Campos originales del dataset
  id_proveedor: number;
  nombreProducto: string;
  descripcion: string;
  unidadMedida: string;
  precio: number;
  disponibilidad: boolean;

  // Campos opcionales para compatibilidad con componentes
  id?: number;
  proveedorId?: number;
  nombre?: string;
  disponible?: boolean;
}
