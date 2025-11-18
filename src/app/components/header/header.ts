import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './../../services/auth';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class Header {

  logueado = false;
  nombreUsuario = '';

  constructor(private auth: AuthService, private router: Router) {

    // Observar el estado global
    this.auth.logueado$.subscribe(val => this.logueado = val);
    this.auth.nombreUsuario$.subscribe(name => this.nombreUsuario = name);
  }

  mostrar_acerca_de() {
    this.router.navigate(['/acerca-de']);
  }

  mostrar_iniciar_sesion() {
    this.router.navigate(['/']);
  }

  cerrar_sesion() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
