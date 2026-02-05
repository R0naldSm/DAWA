import { Component, inject, OnInit } from '@angular/core';
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
export class Header implements OnInit {

  private auth = inject(AuthService);
  private router = inject(Router);

  logueado: boolean = false;
  nombreUsuario: string = '';

  ngOnInit() {
    this.auth.logueado$.subscribe(val => this.logueado = val);
    this.auth.nombreUsuario$.subscribe(name => this.nombreUsuario = name);
  }

  irAlInicio() {
    if (this.logueado) {
      this.router.navigate(['/principal']);
    } else {
      this.router.navigate(['/']);
    }
  }

  mostrar_acerca_de() {
    this.router.navigate(['/']);
  }

  mostrar_iniciar_sesion() {
    this.router.navigate(['/login']);
  }

  cerrar_sesion() {
    this.auth.logout();
  }
}
