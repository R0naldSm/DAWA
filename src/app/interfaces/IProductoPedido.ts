export interface IProductoPedido {
  id: number;
  cantidad: number;
  nombreProducto?: string;
  precioUnitario?: number;
  subtotal?: number;
}