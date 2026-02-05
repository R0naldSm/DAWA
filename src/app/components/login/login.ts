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

  // Variables de Control Visual
  vistaActual: string = 'login';

  // Datos del Formulario
  loginData = { usuario: '', clave: '' };

  // Datos de Registro
  confirmarClave: string = '';
  registroData = { nombres: '', usuario: '', clave: '', rol: 'OPERADOR' };

  // Variables de Recuperación (Las que faltaban)
  pasoRecuperacion: number = 1;
  usuarioRecuperar: string = '';
  nuevaClave: string = '';
  confirmarNuevaClave: string = '';

  // --- LÓGICA DE CONEXIÓN ---

  procesarLogin() {
    if (!this.loginData.usuario || !this.loginData.clave) {
      alert('Por favor complete los campos.');
      return;
    }

    // Llamada real al Docker
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
        // El backend devuelve error en el body a veces
        const mensaje = err.error?.error || 'Error al procesar el registro.';
        alert(mensaje);
      }
    });
  }

  // --- LÓGICA VISUAL (Sin cambios, solo para que funcione el HTML) ---

  verificarUsuarioExiste() {
    if(!this.usuarioRecuperar) return;
    // Simulado
    this.pasoRecuperacion = 2;
  }

  guardarNuevaClave() {
    if (this.nuevaClave !== this.confirmarNuevaClave) {
      alert('Las claves no coinciden');
      return;
    }
    alert('Clave actualizada (Simulación)');
    this.cambiarVista('login');
  }

  cambiarVista(vista: string) {
    this.vistaActual = vista;
    this.pasoRecuperacion = 1;
    // Limpieza
    this.usuarioRecuperar = '';
    this.nuevaClave = '';
  }

  cerrar() {
    this.auth.cerrarLogin();
    this.vistaActual = 'login';
  }
}
