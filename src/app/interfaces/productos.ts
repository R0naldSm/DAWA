import { Proveedor } from './proveedor';

export interface Producto {
  id?: number;
  proveedorId: Proveedor['IdProveedor'];
  nombre: string;
  descripcion?: string;
  unidadMedida?: string;
  precio: number;
  disponible: boolean;
  estado?: string; // 'A' = Activo, 'I' = Inactivo (eliminado lógicamente)
}
