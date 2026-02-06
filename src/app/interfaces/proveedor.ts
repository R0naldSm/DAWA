export interface Proveedor {
  IdProveedor?: number;
  Ruc: string;
  Nombre: string;
  Categoria?: string;
  Telefono?: string;
  Email?: string;
  Contacto?: string;
  Direccion?: string;
  Estado?: number;
  Transaccion?: string;
}

export interface FiltroProveedor {
  Busqueda: string;
  Transaccion?: string;
}
