import { AuthService } from './../../services/auth';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Footer from '../footer/footer';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule,Footer],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export default class Login {

  usuario: string = '';
  clave: string = '';

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    alert('Se procederá a validar las credenciales de acceso');

    if (!this.usuario || !this.clave) {
      alert('Por favor, complete todos los campos.');
      return;
    }

    if (this.clave.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    const acceso = this.auth.login(this.usuario.trim(), this.clave);

    if (acceso) {
      alert('¡Inicio de sesión exitoso!');

      // Redirigir a la página principal
      this.router.navigate(['/principal']);
    } else {
      alert('Credenciales incorrectas. Inténtelo de nuevo.');
    }
  }
}
