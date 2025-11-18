export interface Pedido {
  id_pedido: number;
  nombre_proveedor: string;
  fecha_creacion_pedido: string;
  fecha_estimada_entrega: string;
  estado: string;
  total: number;
  observaciones: string;
}