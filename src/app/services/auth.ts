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

  // Estado global de login (persistido en localStorage)
  private logueadoSource = new BehaviorSubject<boolean>(localStorage.getItem('logueado') === 'true');
  logueado$ = this.logueadoSource.asObservable();

  private nombreSource = new BehaviorSubject<string>(localStorage.getItem('nombreUsuario') || '');
  nombreUsuario$ = this.nombreSource.asObservable();

  // Método para validar credenciales
  login(usuario: string, clave: string): boolean {
    if (usuario === this.usuarioValido.usuario && clave === this.usuarioValido.clave) {
      this.logueadoSource.next(true);
      this.nombreSource.next(this.usuarioValido.nombre);

      // Persistir en localStorage para mantener la sesión al recargar
      try {
        localStorage.setItem('logueado', 'true');
        localStorage.setItem('nombreUsuario', this.usuarioValido.nombre);
      } catch (e) {
        // Si no es posible (p. ej. modo privado), continuar sin persistencia
        console.warn('No se pudo persistir estado de login en localStorage', e);
      }
      return true;
    }
    return false;
  }

  // Cerrar sesión
  logout() {
    this.logueadoSource.next(false);
    this.nombreSource.next('');

    try {
      localStorage.removeItem('logueado');
      localStorage.removeItem('nombreUsuario');
    } catch (e) {
      console.warn('No se pudo limpiar localStorage durante logout', e);
    }
  }
}
