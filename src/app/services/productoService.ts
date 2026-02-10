import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { Producto } from '../interfaces/productos';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  private readonly http = inject(HttpClient);
  private auth = inject(AuthService);

  // IMPORTANTE: Puerto 5000 suele ser HTTP. Si usas HTTPS es otro puerto (ej. 7192 o 443).
  // Si tu backend corre en https, cambia esto a 'https'.
  private readonly baseUrl = 'http://localhost:5000/api/Productos';

  private getHeaders() {
    const token = this.auth.getToken();
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    };
  }

  // --- MÉTODOS PÚBLICOS ---

  // 1. GET PRODUCTOS (Vía POST como pide tu backend)
  getProductos(incluirInactivos: boolean = false): Observable<Producto[]> {
    // Tu backend espera [FromBody] Productos filtro.
    // Enviamos un objeto vacío o con filtros básicos si fuera necesario.
    const body = {};

    return this.http
      .post<ProductosApi[]>(`${this.baseUrl}/GetProductos`, body, this.getHeaders())
      .pipe(
        map((rows) =>
          (Array.isArray(rows) ? rows : [])
            .map((r) => this.fromApi(r))
            .filter((p) => incluirInactivos || p.estado === 'A' || p.estado === '6')
        )
      );
  }

  // 2. GET BY ID (Vía POST como pide tu backend)
  getById(id: number): Observable<Producto | null> {
    if (!id) return of(null);

    // Tu backend espera un objeto Productos con el ID dentro.
    const body = { idProductos: id };

    return this.http
      .post<ProductosApi>(`${this.baseUrl}/GetProductoPorId`, body, this.getHeaders())
      .pipe(map((row) => (row ? this.fromApi(row) : null)));
  }

  // 3. CREATE
  create(payload: Producto): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/InsertarProducto`, this.toApi(payload), this.getHeaders());
  }

  // 4. UPDATE
  update(payload: Producto): Observable<unknown> {
    return this.http.put(`${this.baseUrl}/ActualizarProducto`, this.toApi(payload), this.getHeaders());
  }

  // 5. DELETE (Ojo: Delete con Body en Angular requiere configuración especial)
  delete(producto: Producto | number): Observable<unknown> {
    const headers = this.getHeaders();
    let bodyData: any;

    if (typeof producto === 'number') {
      bodyData = { idProductos: producto };
    } else {
      bodyData = this.toApi(producto);
    }

    // Para enviar Body en un DELETE, se usa la propiedad 'body' dentro de las opciones
    return this.http.delete(`${this.baseUrl}/EliminarProducto`, {
      headers: headers.headers,
      body: bodyData
    });
  }

  // --- MAPPERS ---

  private toApi(ui: Producto): ProductosApi {
    return {
      idProductos: ui.id,
      IdProveedor: ui.proveedorId,
      nombre: ui.nombre,
      descripcion: ui.descripcion ?? '',
      unidadMedida: ui.unidadMedida ?? '',
      precio: ui.precio,
      disponible: ui.disponible ? 'S' : 'N',
      estado: ui.estado ?? 'A',
      Estado: ui.estado ?? 'A',
    };
  }

  private fromApi(api: ProductosApi): Producto {
    const rawId = api.idProductos ?? api.IdProductos ?? api.IdProducto ?? 0;

    // Lógica robusta para encontrar el ID del proveedor
    const rawProveedorId = (
      api.IdProveedor ??
      api.idProveedor ??
      api.proveedorId ??
      api.ProveedorId ??
      api.Id_Proveedor ??
      api.id_proveedor ??
      pickNumberCaseInsensitive(api, ['IdProveedor', 'ProveedorId', 'Id_Proveedor', 'idProveedor', 'id_proveedor', 'proveedorId'])
    ) || pickNumberByKeySubstring(api, 'proveedor');

    return {
      id: toNumber(rawId) || undefined,
      proveedorId: toNumber(rawProveedorId),
      nombre: String(api.nombre ?? api.Nombre ?? ''),
      descripcion: String(api.descripcion ?? api.Descripcion ?? '') || undefined,
      unidadMedida: String(api.unidadMedida ?? api.UnidadMedida ?? api.Unidad_Medida ?? '') || undefined,
      precio: Number(api.precio ?? api.Precio ?? 0),
      disponible: parseDisponible(api.disponible ?? api.Disponible),
      estado: String(api.estado ?? api.Estado ?? 'A'),
    };
  }
}

// --- UTILIDADES ---

type ProductosApi = {
  idProductos?: number;  IdProductos?: number;  IdProducto?: number;
  IdProveedor?: number;  idProveedor?: number;  proveedorId?: number;  ProveedorId?: number;  Id_Proveedor?: number;  id_proveedor?: number;
  nombre?: string;       Nombre?: string;
  descripcion?: string;  Descripcion?: string;
  unidadMedida?: string; UnidadMedida?: string; Unidad_Medida?: string;
  precio?: number;       Precio?: number;
  disponible?: boolean | string | number | null; Disponible?: boolean | string | number | null;
  estado?: string | null; Estado?: string | null;
};

function parseDisponible(value: unknown): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value !== 0;
  if (typeof value === 'string') {
    const v = value.trim().toLowerCase();
    return v === 'true' || v === '1' || v === 's' || v === 'si' || v === 'sí' || v === 'y';
  }
  return false;
}

function toNumber(value: unknown): number {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  if (typeof value === 'string') {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

function pickNumberCaseInsensitive(obj: unknown, keys: string[]): number {
  if (!obj || typeof obj !== 'object') return 0;
  const rec = obj as Record<string, unknown>;
  const wanted = new Set(keys.map((k) => k.toLowerCase()));
  for (const k of Object.keys(rec)) {
    if (wanted.has(k.toLowerCase())) return toNumber(rec[k]);
  }
  return 0;
}

function pickNumberByKeySubstring(obj: unknown, substring: string): number {
  if (!obj || typeof obj !== 'object') return 0;
  const rec = obj as Record<string, unknown>;
  const needle = substring.toLowerCase();
  for (const k of Object.keys(rec)) {
    if (k.toLowerCase().includes(needle)) {
      const n = toNumber(rec[k]);
      if (n) return n;
    }
  }
  return 0;
}
