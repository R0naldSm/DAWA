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

    alert('Se procederá a validar las credenciales de acceso');

    if (!usuario || !contrasena) {
      alert('Por favor, complete todos los campos.');
      return;
    }
    if (contrasena.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (usuario === 'admin' && contrasena === 'admin123') {
      setTimeout(() => {
        alert('¡Inicio de sesión exitoso!');
        this.usuarioServicio.usuarioLogueado = true
      }, 2000);
    } else {
      alert('Credenciales incorrectas. Inténtelo de nuevo.');
    }
  }
}
