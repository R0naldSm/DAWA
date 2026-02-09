import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../interfaces/usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'http://localhost:5000/api/Auth';

  private usuarioActualSubject = new BehaviorSubject<any>(this.getUserFromStorage());
  usuarioActual$ = this.usuarioActualSubject.asObservable();

  mostrarLoginModal = new BehaviorSubject<boolean>(false);
  mostrarLoginModal$ = this.mostrarLoginModal.asObservable();

  get logueado$(): Observable<boolean> {
    return this.usuarioActual$.pipe(map(u => !!u));
  }

  get nombreUsuario$(): Observable<string> {
    return this.usuarioActual$.pipe(map(u => {
      if (!u) return '';
      return u.Nombres || u.nombres || u.Nombre_Usuario || 'Usuario';
    }));
  }

  login(usuario: string, clave: string): Observable<any> {
    const body: any = { Nombre_Usuario: usuario, Clave: clave, Transaccion: 'LOGIN' };

    return this.http.post(`${this.apiUrl}/ValidarUsuario`, body).pipe(
      tap((res: any) => {
        if (res && res.token) {
          localStorage.setItem('token', res.token);

          const userObj = res.usuario;
          localStorage.setItem('user', JSON.stringify(userObj));

          this.usuarioActualSubject.next(userObj);

          this.cerrarLogin();
        }
      })
    );
  }

  registrar(datos: any): Observable<any> {
    const body: Usuario = {
      Nombres: datos.nombres,
      Nombre_Usuario: datos.usuario,
      Clave: datos.clave,
      Rol: datos.rol,
      Transaccion: 'REGISTRAR'
    };
    return this.http.post(`${this.apiUrl}/RegistrarUsuario`, body);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.usuarioActualSubject.next(null);
    this.router.navigate(['/']);
  }

  private getUserFromStorage() {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch { return null; }
  }

  getToken() { return localStorage.getItem('token'); }
  abrirLogin() { this.mostrarLoginModal.next(true); }
  cerrarLogin() { this.mostrarLoginModal.next(false); }

  // Devuelve el usuario actual (sincrónico)
  getCurrentUser(): any {
    return this.usuarioActualSubject.value;
  }

  existeUsuario(u: string): boolean { return true; }

  actualizarClave(usuario: string, nuevaClave: string): Observable<any> {
    const body: any = {
      Nombre_Usuario: usuario,
      Clave: nuevaClave,
      Transaccion: 'RECUPERAR'
    };
    return this.http.post(`${this.apiUrl}/RecuperarClave`, body);
  }
}
