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

  private readonly baseUrl = 'https://localhost:5000/api/Productos';

  private getHeaders() {
    const token = this.auth.getToken();
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    };
  }

  // DTO aproximado del backend (nombres típicos del modelo C#).
  // El backend parece aceptar variantes de columnas/nombres; aquí enviamos los más comunes.
  private toApi(ui: Producto): ProductosApi {
    return {
      idProductos: ui.id,
      IdProveedor: ui.proveedorId,
      nombre: ui.nombre,
      descripcion: ui.descripcion ?? '', // Enviar siempre, nunca null
      unidadMedida: ui.unidadMedida ?? '', // Enviar siempre, nunca null
      precio: ui.precio,
      // En tu backend, `disponible` se trata como string al leer DataRow.
      // Para evitar error de model-binding (bool -> string), enviamos "S"/"N".
      disponible: ui.disponible ? 'S' : 'N',
      // Muchos SPs esperan estado (A/I) o similar.
      estado: ui.estado ?? 'A',
      Estado: ui.estado ?? 'A',
    };
  }

  private fromApi(api: ProductosApi): Producto {
    const rawId = api.idProductos ?? api.IdProductos ?? api.IdProducto ?? 0;
    const rawProveedorId = (
      api.IdProveedor ??
      api.idProveedor ??
      api.proveedorId ??
      api.ProveedorId ??
      api.Id_Proveedor ??
      api.id_proveedor ??
      pickNumberCaseInsensitive(api, ['IdProveedor', 'ProveedorId', 'Id_Proveedor', 'idProveedor', 'id_proveedor', 'proveedorId'])
    ) || pickNumberByKeySubstring(api, 'proveedor');

    const id = toNumber(rawId) || undefined;
    const proveedorId = toNumber(rawProveedorId);

    if (id && (!proveedorId || proveedorId <= 0)) {
      // eslint-disable-next-line no-console
      console.warn('Producto sin IdProveedor en respuesta backend:', {
        id,
        keys: Object.keys(api as any),
      });
    }

    return {
      id: toNumber(rawId) || undefined,
      proveedorId,
      nombre: String(api.nombre ?? api.Nombre ?? ''),
      descripcion: String(api.descripcion ?? api.Descripcion ?? '') || undefined,
      unidadMedida: String(api.unidadMedida ?? api.UnidadMedida ?? api.Unidad_Medida ?? '') || undefined,
      precio: Number(api.precio ?? api.Precio ?? 0),
      disponible: parseDisponible(api.disponible ?? api.Disponible),
      estado: String(api.estado ?? api.Estado ?? 'A'),
    };
  }

  getProductos(filtro?: Partial<ProductosApi>, incluirInactivos: boolean = false): Observable<Producto[]> {
    return this.http
      .post<ProductosApi[]>(`${this.baseUrl}/GetProductos`, filtro ?? {}, this.getHeaders())
      .pipe(
        map((rows) =>
          (Array.isArray(rows) ? rows : [])
            .map((r) => this.fromApi(r))
            .filter((p) => incluirInactivos || p.estado === 'A' || p.estado === '6') // estados visibles: 'A' y '6'
        )
      );
  }

  getById(id: number): Observable<Producto | null> {
    if (!id) return of(null);
    return this.http
      .post<ProductosApi>(`${this.baseUrl}/GetProductoPorId`, { idProductos: id }, this.getHeaders())
      .pipe(map((row) => (row ? this.fromApi(row) : null)));
  }

  create(payload: Producto): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/InsertarProducto`, this.toApi(payload), this.getHeaders());
  }

  update(payload: Producto): Observable<unknown> {
    return this.http.put(`${this.baseUrl}/ActualizarProducto`, this.toApi(payload), this.getHeaders());
  }

  delete(producto: Producto | number): Observable<unknown> {
    const headers = this.getHeaders();
    if (typeof producto === 'number') {
      // Si solo recibe el ID, enviamos un objeto minimal pero completo
      return this.http.delete(`${this.baseUrl}/EliminarProducto`, { ...headers, body: { idProductos: producto } });
    }
    // Si recibe el objeto completo, lo enviamos con todos los campos
    return this.http.delete(`${this.baseUrl}/EliminarProducto`, { ...headers, body: this.toApi(producto) });
  }
}

type ProductosApi = {
  // IDs
  idProductos?: number;
  IdProductos?: number;
  IdProducto?: number;

  // proveedor
  IdProveedor?: number;
  idProveedor?: number;
  proveedorId?: number;
  ProveedorId?: number;
  Id_Proveedor?: number;
  id_proveedor?: number;

  // campos
  nombre?: string;
  Nombre?: string;
  descripcion?: string;
  Descripcion?: string;
  unidadMedida?: string;
  UnidadMedida?: string;
  Unidad_Medida?: string;
  precio?: number;
  Precio?: number;
  disponible?: boolean | string | number | null;
  Disponible?: boolean | string | number | null;
  estado?: string | null;
  Estado?: string | null;
};

function parseDisponible(value: unknown): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value !== 0;
  if (typeof value === 'string') {
    const v = value.trim().toLowerCase();
    if (v === 'true' || v === '1' || v === 's' || v === 'si' || v === 'sí' || v === 'y') return true;
    if (v === 'false' || v === '0' || v === 'n' || v === 'no') return false;
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
    if (wanted.has(k.toLowerCase())) {
      return toNumber(rec[k]);
    }
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
