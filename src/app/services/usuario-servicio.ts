import { Injectable } from '@angular/core';
import { Usuario } from '../interfaces/usuario';

@Injectable({
  providedIn: 'root',
})
export class UsuarioServicio {
  usuarioLogueado: Usuario = {
    usuario: '',
    password: ''
  };

  private usuarios: Usuario[] = [
    {
      usuario: "admin",
      password: "admin123"
    }
  ]

  login(usuario: string, password: string): boolean {
    const usuarioEncontrado = this.usuarios.find(
      (u) => u.usuario === usuario && u.password === password
    );
    if (usuarioEncontrado) {
      this.usuarioLogueado = {
        usuario: usuarioEncontrado.usuario,
        password: usuarioEncontrado.password
      };
      return true;
    } else {
      return false;
    }
  }

}
