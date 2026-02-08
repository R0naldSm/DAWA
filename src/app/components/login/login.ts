import { AuthService} from './../../services/auth';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {

  private auth = inject(AuthService);
  private router = inject(Router);

  vistaActual: string = 'login';
  loginData = { usuario: '', clave: '' };
  confirmarClave: string = '';
  registroData = { nombres: '', usuario: '', clave: '', rol: 'OPERADOR' };
  pasoRecuperacion: number = 1;
  usuarioRecuperar: string = '';
  nuevaClave: string = '';
  confirmarNuevaClave: string = '';

  procesarLogin() {
    if (!this.loginData.usuario || !this.loginData.clave) {
      alert('Por favor complete los campos.');
      return;
    }
    this.auth.login(this.loginData.usuario, this.loginData.clave).subscribe({
      next: (res) => {
        alert(`¡Bienvenido al Sistema!`);
        this.router.navigate(['/principal']);
      },
      error: (err) => {
        console.error(err);
        alert('Error: Usuario o contraseña incorrectos.');
      }
    });
  }

  procesarRegistro() {
    if (this.registroData.clave !== this.confirmarClave) {
      alert('Las contraseñas no coinciden');
      return;
    }

    this.auth.registrar(this.registroData).subscribe({
      next: (res) => {
        alert('Usuario registrado correctamente. Inicie sesión.');
        this.cambiarVista('login');
      },
      error: (err) => {
        console.error(err);
        const mensaje = err.error?.error || 'Error al procesar el registro.';
        alert(mensaje);
      }
    });
  }

  verificarUsuarioExiste() {
    if(!this.usuarioRecuperar) return;
    this.pasoRecuperacion = 2;
  }

  guardarNuevaClave() {
    if (this.nuevaClave !== this.confirmarNuevaClave) {
      alert('Las contraseñas no coinciden');
      return;
    }

    if (this.nuevaClave.length < 4) {
      alert('La contraseña es muy corta');
      return;
    }
    this.auth.actualizarClave(this.usuarioRecuperar, this.nuevaClave).subscribe({
      next: (res: any) => {
        alert(res.mensaje || 'Clave actualizada correctamente');
        this.cambiarVista('login');
      },
      error: (err) => {
        console.error(err);
        alert('Error: ' + (err.error?.error || 'No se pudo actualizar la clave'));
      }
    });
  }

  cambiarVista(vista: string) {
    this.vistaActual = vista;
    this.pasoRecuperacion = 1;
    this.usuarioRecuperar = '';
    this.nuevaClave = '';
  }

  cerrar() {
    this.auth.cerrarLogin();
    this.vistaActual = 'login';
  }
}
