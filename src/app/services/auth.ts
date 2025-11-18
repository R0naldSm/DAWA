import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Usuario válido para la actividad
  public usuarioValido = {
    usuario: 'admin',
    clave: 'admin123',
    nombre: 'Administrador del Sistema'
  };

  // Estado global de login
  private logueadoSource = new BehaviorSubject<boolean>(false);
  logueado$ = this.logueadoSource.asObservable();

  private nombreSource = new BehaviorSubject<string>('');
  nombreUsuario$ = this.nombreSource.asObservable();

  // Método para validar credenciales
  login(usuario: string, clave: string): boolean {
    if (usuario === this.usuarioValido.usuario && clave === this.usuarioValido.clave) {
      this.logueadoSource.next(true);
      this.nombreSource.next(this.usuarioValido.nombre);
      return true;
    }
    return false;
  }

  // Cerrar sesión
  logout() {
    this.logueadoSource.next(false);
    this.nombreSource.next('');
  }
}
