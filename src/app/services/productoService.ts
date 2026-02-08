import { Injectable, inject } from '@angular/core';
import { Producto } from '../interfaces/productos';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  private productos: Producto[] = [
    {
      id_proveedor: 1,
      nombre: "Laptop HP ProBook 450",
      descripcion: "Laptop empresarial con procesador Intel i5 y 16GB RAM",
      unidadMedida: "unidad",
      precio: 950.00,
      disponibilidad: true
    },
    {
      id_proveedor: 2,
      nombre: "Fertilizante Orgánico AndesGrow",
      descripcion: "Fertilizante natural para cultivos de hortalizas y frutas",
      unidadMedida: "saco (50kg)",
      precio: 28.50,
      disponibilidad: true
    },
    {
      id_proveedor: 3,
      nombre: "Cemento Portland 50kg",
      descripcion: "Cemento de alta resistencia para construcción general",
      unidadMedida: "saco",
      precio: 9.75,
      disponibilidad: true
    },
    {
      id_proveedor: 4,
      nombre: "Aceite de Girasol El Oro",
      descripcion: "Aceite vegetal 100% natural, ideal para cocinar",
      unidadMedida: "litro",
      precio: 3.20,
      disponibilidad: true
    },
    {
      id_proveedor: 5,
      nombre: "Guantes de Latex Médicos",
      descripcion: "Guantes desechables para uso médico y laboratorio",
      unidadMedida: "caja (100 unidades)",
      precio: 12.90,
      disponibilidad: false
    },
    {
      id_proveedor: 6,
      nombre: "Foco LED 15W",
      descripcion: "Foco de bajo consumo, luz blanca fría 6500K",
      unidadMedida: "unidad",
      precio: 2.80,
      disponibilidad: true
    },
    {
      id_proveedor: 7,
      nombre: "Cartucho de Tinta HP 662",
      descripcion: "Cartucho negro compatible con impresoras HP DeskJet",
      unidadMedida: "unidad",
      precio: 17.40,
      disponibilidad: true
    },
    {
      id_proveedor: 8,
      nombre: "Agua Mineral 500ml",
      descripcion: "Agua purificada de manantial andino",
      unidadMedida: "botella",
      precio: 0.75,
      disponibilidad: true
    },
    {
      id_proveedor: 9,
      nombre: "Lubricante Automotriz 20W50",
      descripcion: "Aceite de motor multigrado para vehículos a gasolina",
      unidadMedida: "galón",
      precio: 22.00,
      disponibilidad: true
    },
    {
      id_proveedor: 10,
      nombre: "Camiseta de Algodón Eco",
      descripcion: "Camiseta ecológica elaborada con algodón reciclado",
      unidadMedida: "unidad",
      precio: 8.50,
      disponibilidad: false
    },
    {
      id_proveedor: 11,
      nombre: "Cereal Natural Mix 500g",
      descripcion: "Cereal con avena, pasas y frutos secos sin azúcar",
      unidadMedida: "paquete",
      precio: 4.30,
      disponibilidad: true
    },
    {
      id_proveedor: 12,
      nombre: "Martillo de Acero 16oz",
      descripcion: "Martillo de uso general con mango de goma",
      unidadMedida: "unidad",
      precio: 6.90,
      disponibilidad: true
    },
    {
      id_proveedor: 13,
      nombre: "Router Wi-Fi D-Link N300",
      descripcion: "Router inalámbrico con velocidad de hasta 300 Mbps",
      unidadMedida: "unidad",
      precio: 32.00,
      disponibilidad: true
    },
    {
      id_proveedor: 14,
      nombre: "Semillas de Papa SuperAndina",
      descripcion: "Semillas certificadas para cultivo de papa de altura",
      unidadMedida: "saco (25kg)",
      precio: 18.20,
      disponibilidad: false
    },
    {
      id_proveedor: 15,
      nombre: "Televisor LED 43'' Full HD",
      descripcion: "Televisor de alta definición con entrada HDMI y USB",
      unidadMedida: "unidad",
      precio: 379.00,
      disponibilidad: true
    },
    {
      id_proveedor: 16,
      nombre: "Caja de Mangos Orgánicos",
      descripcion: "Caja de 10kg de mangos orgánicos certificados",
      unidadMedida: "caja",
      precio: 21.50,
      disponibilidad: true
    },
    {
      id_proveedor: 17,
      nombre: "Resma de Papel A4 80g",
      descripcion: "Papel blanco de alta calidad para impresión y copiado",
      unidadMedida: "paquete (500 hojas)",
      precio: 5.25,
      disponibilidad: true
    },
    {
      id_proveedor: 18,
      nombre: "Servicio de Transporte Logístico",
      descripcion: "Transporte de mercancías dentro del Ecuador",
      unidadMedida: "servicio",
      precio: 150.00,
      disponibilidad: true
    },
    {
      id_proveedor: 19,
      nombre: "Mouse Gamer RGB",
      descripcion: "Mouse ergonómico con iluminación RGB y 6 botones",
      unidadMedida: "unidad",
      precio: 24.99,
      disponibilidad: false
    },
    {
      id_proveedor: 20,
      nombre: "Shampoo Natural BioHerbal",
      descripcion: "Shampoo con extractos naturales de romero y aloe vera",
      unidadMedida: "botella (500ml)",
      precio: 6.80,
      disponibilidad: true
    }
  ];

  private nextId = 1;

  constructor() {
    // Asignar IDs y campos de compatibilidad al iniciar
    this.productos = this.productos.map((p, index) => ({
      ...p,
      id: index + 1,
      proveedorId: p.id_proveedor,
      nombre: p.nombre,
      disponible: p.disponibilidad,
    }));
    this.nextId = this.productos.length + 1;
  }

  getProductos(): Producto[] {
    return this.productos;
  }

  getByProveedor(idProveedor: number): Producto[] {
    return this.productos.filter(p => (p.id_proveedor === idProveedor) || (p.proveedorId === idProveedor));
  }


  getById(id: number): Producto | undefined {
    return this.productos.find(p => p.id === id);
  }

  create(payload: Producto): Producto {
    const nuevo: Producto = {
      id: this.nextId++,
      id_proveedor: payload.proveedorId ?? payload.id_proveedor ?? 0,
      proveedorId: payload.proveedorId ?? payload.id_proveedor ?? 0,
      nombre: payload.nombre ?? payload.nombre ?? '',
      descripcion: payload.descripcion ?? '',
      unidadMedida: payload.unidadMedida ?? '',
      precio: payload.precio ?? 0,
      disponibilidad: payload.disponible ?? payload.disponibilidad ?? true,
      disponible: payload.disponible ?? payload.disponibilidad ?? true,
    };
    this.productos.push(nuevo);
    return nuevo;
  }

  update(payload: Producto): void {
    if (!payload.id) return;
    const idx = this.productos.findIndex(p => p.id === payload.id);
    if (idx === -1) return;
    const actual = this.productos[idx];
    const actualizado: Producto = {
      ...actual,
      id_proveedor: payload.proveedorId ?? payload.id_proveedor ?? actual.id_proveedor,
      proveedorId: payload.proveedorId ?? payload.id_proveedor ?? actual.proveedorId,
      nombre: payload.nombre ?? payload.nombre ?? actual.nombre,
      descripcion: payload.descripcion ?? actual.descripcion,
      unidadMedida: payload.unidadMedida ?? actual.unidadMedida,
      precio: payload.precio ?? actual.precio,
      disponibilidad: payload.disponible ?? payload.disponibilidad ?? actual.disponibilidad,
      disponible: payload.disponible ?? payload.disponibilidad ?? actual.disponible,
    };
    this.productos[idx] = actualizado;
  }

  delete(id: number): void {
    this.productos = this.productos.filter(p => p.id !== id);
  }

  toggleDisponibilidad(id: number): void {
    const p = this.getById(id);
    if (!p) return;
    const nueva = !(p.disponible ?? p.disponibilidad);
    p.disponibilidad = nueva;
    p.disponible = nueva;
  }


  // consulta a la API (necesario para pedido, modificar si asi lo necesitas)
  private http = inject(HttpClient);
  private auth = inject(AuthService);

  private apiUrl = 'http://localhost:5000/api/Productos';

  private getHeaders() {
    const token = this.auth.getToken();
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    };
  }

  getProductosAPI(): Observable<any[]> {
    const body = {
      Transaccion: 'CONSULTAR'
    };
    return this.http.post<any[]>(`${this.apiUrl}/GetProductos`, body, this.getHeaders());
  }
}
