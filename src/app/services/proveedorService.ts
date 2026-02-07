import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);

  // URL BASE (Asegúrate que sea Singular si tu controller es ProveedorController)
  private apiUrl = 'http://localhost:5000/api/Proveedor';

  private getHeaders() {
    const token = this.auth.getToken();
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    };
  }

  getProveedores(busqueda: string = '', incluirInactivos: boolean = false): Observable<any[]> {
    const body = {
      Busqueda: busqueda,
      IncluirInactivos: incluirInactivos ? 1 : 0,
      Transaccion: 'CONSULTAR'
    };
    return this.http.post<any[]>(`${this.apiUrl}/GetProveedores`, body, this.getHeaders());
  }

  gestionar(proveedor: any, transaccion: 'INSERTAR' | 'EDITAR' | 'ELIMINAR'): Observable<any> {
    const body: any = {
      IdProveedor: proveedor.id || proveedor.IdProveedor || 0,
      Ruc: proveedor.ruc || proveedor.Ruc,
      Nombre: proveedor.nombre || proveedor.Nombre,
      Categoria: proveedor.categoria || proveedor.Categoria,
      Telefono: proveedor.telefono || proveedor.Telefono,
      Email: proveedor.email || proveedor.Email,
      Contacto: proveedor.contacto || proveedor.Contacto,
      Direccion: proveedor.direccion || proveedor.Direccion,
      Estado: proveedor.estado !== undefined ? proveedor.estado : null,
      Transaccion: transaccion
    };

    // FIX 2: Ruta corregida a GestionarProveedor para evitar el 404
    return this.http.post(`${this.apiUrl}/GestionarProveedor`, body, this.getHeaders());
  }

  getProveedorByNombre(nombre: string): Observable<any[]> {
    return this.getProveedores(nombre);
  }
}
