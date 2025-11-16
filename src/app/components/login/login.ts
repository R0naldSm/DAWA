import { Component, inject } from '@angular/core';
import { UsuarioServicio } from '../../services/usuario-servicio';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export default class Login {
  private usuarioServicio = inject(UsuarioServicio)

  login() {
    const usuario = (document.getElementById('usuario') as HTMLInputElement).value;
    const contrasena = (document.getElementById('clave') as HTMLInputElement).value;

    if (!usuario || !contrasena) {
      alert('Por favor, complete todos los campos.');
      return;
    }
    if (contrasena.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (this.usuarioServicio.login(usuario, contrasena)) {
      alert('¡Inicio de sesión exitoso!');
    } else {
      alert('Credenciales incorrectas. Inténtelo de nuevo.');
    }
  }
}
