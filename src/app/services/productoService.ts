import { Injectable } from '@angular/core';
import { Producto } from '../interfaces/productos';
import { DetallePedido } from '../interfaces/detallePedido';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  private productos: Producto[] = [
    {
      id_proveedor: 1,
      nombreProducto: "Laptop HP ProBook 450",
      descripcion: "Laptop empresarial con procesador Intel i5 y 16GB RAM",
      unidadMedida: "unidad",
      precio: 950.00,
      disponibilidad: true
    },
    {
      id_proveedor: 2,
      nombreProducto: "Fertilizante Orgánico AndesGrow",
      descripcion: "Fertilizante natural para cultivos de hortalizas y frutas",
      unidadMedida: "saco (50kg)",
      precio: 28.50,
      disponibilidad: true
    },
    {
      id_proveedor: 3,
      nombreProducto: "Cemento Portland 50kg",
      descripcion: "Cemento de alta resistencia para construcción general",
      unidadMedida: "saco",
      precio: 9.75,
      disponibilidad: true
    },
    {
      id_proveedor: 4,
      nombreProducto: "Aceite de Girasol El Oro",
      descripcion: "Aceite vegetal 100% natural, ideal para cocinar",
      unidadMedida: "litro",
      precio: 3.20,
      disponibilidad: true
    },
    {
      id_proveedor: 5,
      nombreProducto: "Guantes de Latex Médicos",
      descripcion: "Guantes desechables para uso médico y laboratorio",
      unidadMedida: "caja (100 unidades)",
      precio: 12.90,
      disponibilidad: false
    },
    {
      id_proveedor: 6,
      nombreProducto: "Foco LED 15W",
      descripcion: "Foco de bajo consumo, luz blanca fría 6500K",
      unidadMedida: "unidad",
      precio: 2.80,
      disponibilidad: true
    },
    {
      id_proveedor: 7,
      nombreProducto: "Cartucho de Tinta HP 662",
      descripcion: "Cartucho negro compatible con impresoras HP DeskJet",
      unidadMedida: "unidad",
      precio: 17.40,
      disponibilidad: true
    },
    {
      id_proveedor: 8,
      nombreProducto: "Agua Mineral 500ml",
      descripcion: "Agua purificada de manantial andino",
      unidadMedida: "botella",
      precio: 0.75,
      disponibilidad: true
    },
    {
      id_proveedor: 9,
      nombreProducto: "Lubricante Automotriz 20W50",
      descripcion: "Aceite de motor multigrado para vehículos a gasolina",
      unidadMedida: "galón",
      precio: 22.00,
      disponibilidad: true
    },
    {
      id_proveedor: 10,
      nombreProducto: "Camiseta de Algodón Eco",
      descripcion: "Camiseta ecológica elaborada con algodón reciclado",
      unidadMedida: "unidad",
      precio: 8.50,
      disponibilidad: false
    },
    {
      id_proveedor: 11,
      nombreProducto: "Cereal Natural Mix 500g",
      descripcion: "Cereal con avena, pasas y frutos secos sin azúcar",
      unidadMedida: "paquete",
      precio: 4.30,
      disponibilidad: true
    },
    {
      id_proveedor: 12,
      nombreProducto: "Martillo de Acero 16oz",
      descripcion: "Martillo de uso general con mango de goma",
      unidadMedida: "unidad",
      precio: 6.90,
      disponibilidad: true
    },
    {
      id_proveedor: 13,
      nombreProducto: "Router Wi-Fi D-Link N300",
      descripcion: "Router inalámbrico con velocidad de hasta 300 Mbps",
      unidadMedida: "unidad",
      precio: 32.00,
      disponibilidad: true
    },
    {
      id_proveedor: 14,
      nombreProducto: "Semillas de Papa SuperAndina",
      descripcion: "Semillas certificadas para cultivo de papa de altura",
      unidadMedida: "saco (25kg)",
      precio: 18.20,
      disponibilidad: false
    },
    {
      id_proveedor: 15,
      nombreProducto: "Televisor LED 43'' Full HD",
      descripcion: "Televisor de alta definición con entrada HDMI y USB",
      unidadMedida: "unidad",
      precio: 379.00,
      disponibilidad: true
    },
    {
      id_proveedor: 16,
      nombreProducto: "Caja de Mangos Orgánicos",
      descripcion: "Caja de 10kg de mangos orgánicos certificados",
      unidadMedida: "caja",
      precio: 21.50,
      disponibilidad: true
    },
    {
      id_proveedor: 17,
      nombreProducto: "Resma de Papel A4 80g",
      descripcion: "Papel blanco de alta calidad para impresión y copiado",
      unidadMedida: "paquete (500 hojas)",
      precio: 5.25,
      disponibilidad: true
    },
    {
      id_proveedor: 18,
      nombreProducto: "Servicio de Transporte Logístico",
      descripcion: "Transporte de mercancías dentro del Ecuador",
      unidadMedida: "servicio",
      precio: 150.00,
      disponibilidad: true
    },
    {
      id_proveedor: 19,
      nombreProducto: "Mouse Gamer RGB",
      descripcion: "Mouse ergonómico con iluminación RGB y 6 botones",
      unidadMedida: "unidad",
      precio: 24.99,
      disponibilidad: false
    },
    {
      id_proveedor: 20,
      nombreProducto: "Shampoo Natural BioHerbal",
      descripcion: "Shampoo con extractos naturales de romero y aloe vera",
      unidadMedida: "botella (500ml)",
      precio: 6.80,
      disponibilidad: true
    }
  ];
  private detallesPedido: DetallePedido[] = [
    // Pedido 1 – Tech Solutions S.A.
    {
      idDetalle: 1,
      idPedido: 1,
      producto: "Laptop HP ProBook 450",
      cantidad: 2,
      precioUnitario: 950.00,
      total: 1900.00
    },

    // Pedido 2 – AgroAndes
    {
      idDetalle: 2,
      idPedido: 2,
      producto: "Fertilizante Orgánico AndesGrow",
      cantidad: 4,
      precioUnitario: 28.50,
      total: 114.00
    },

    // Pedido 3 – Construec
    {
      idDetalle: 3,
      idPedido: 3,
      producto: "Cemento Portland 50kg",
      cantidad: 40,
      precioUnitario: 9.75,
      total: 390.00
    },

    // Pedido 4 – Medicorps
    {
      idDetalle: 4,
      idPedido: 4,
      producto: "Guantes de Latex Médicos",
      cantidad: 3,
      precioUnitario: 12.90,
      total: 38.70
    },

    // Pedido 5 – GlobalNet
    {
      idDetalle: 5,
      idPedido: 5,
      producto: "Router Wi-Fi D-Link N300",
      cantidad: 3,
      precioUnitario: 32.00,
      total: 96.00
    },

    // Pedido 6 – CompuStore
    {
      idDetalle: 6,
      idPedido: 6,
      producto: "Mouse Gamer RGB",
      cantidad: 3,
      precioUnitario: 24.99,
      total: 74.97
    }
  ];

  getProductos(): Producto[] {
      return this.productos;
    }
}
