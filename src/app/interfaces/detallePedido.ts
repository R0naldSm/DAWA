export interface DetallePedido{
  idDetalle: number,
  idPedido: number,
  producto: string,
  cantidad: number,
  precioUnitario: number,
  total: number
}