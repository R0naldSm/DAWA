import { AuthService } from './../../services/auth';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-proveedores',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './proveedores.html',
  styleUrls: ['./proveedores.css'],
})
export default class Proveedores {

  proveedores = [
    { nombre: 'AgroFertilizantes S.A.', ruc: '0999999999', telefono: '0987654321' },
    { nombre: 'Distribuidora Los Ríos', ruc: '0123456789', telefono: '0991122334' },
    { nombre: 'Semillas del Litoral', ruc: '0987654321', telefono: '0970011223' },
  ];

  buscarTexto = '';
  nombreUsuario = '';

  constructor(private auth: AuthService, private router: Router) {

    // Suscribirse al nombre del usuario
    this.auth.nombreUsuario$.subscribe(n => this.nombreUsuario = n);

    // Si NO está logueado → redirigir al login
    this.auth.logueado$.subscribe(log => {
      if (!log) {
        this.router.navigate(['/']);
      }
    });
  }

  get proveedoresFiltrados() {
    return this.proveedores.filter(p =>
      p.nombre.toLowerCase().includes(this.buscarTexto.toLowerCase())
    );
  }

}
