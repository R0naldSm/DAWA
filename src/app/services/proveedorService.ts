import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth';
import { Proveedor, FiltroProveedor } from '../interfaces/proveedor';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);

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

  getProveedores(busqueda: string = ''): Observable<Proveedor[]> {
    const body: FiltroProveedor = {
      Busqueda: busqueda,
      Transaccion: 'CONSULTAR'
    };
    return this.http.post<Proveedor[]>(`${this.apiUrl}/GetProveedores`, body, this.getHeaders());
  }

  gestionar(proveedor: any, transaccion: 'INSERTAR' | 'EDITAR' | 'ELIMINAR'): Observable<any> {
    const body: Proveedor = {
      IdProveedor: proveedor.id || proveedor.IdProveedor || 0,
      Ruc: proveedor.ruc || proveedor.Ruc,
      Nombre: proveedor.nombre || proveedor.Nombre,
      Categoria: proveedor.categoria || proveedor.Categoria,
      Telefono: proveedor.telefono || proveedor.Telefono,
      Email: proveedor.email || proveedor.Email,
      Contacto: proveedor.contacto || proveedor.Contacto,
      Direccion: proveedor.direccion || proveedor.Direccion,
      Transaccion: transaccion
    };

    return this.http.post(`${this.apiUrl}/GestionarProveedor`, body, this.getHeaders());
  }

  getProveedorByNombre(nombre: string): Observable<Proveedor[]> {
    return this.getProveedores(nombre);
  }
}
