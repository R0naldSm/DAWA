import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './principal.html',
  styleUrls: ['./principal.css'],
})
export class Principal implements OnInit {

  private auth = inject(AuthService);
  private router = inject(Router);

  nombreUsuario: string = '';
  rolUsuario: string = '';
  esAdmin: boolean = false;

  ngOnInit() {
    this.auth.usuarioActual$.subscribe(u => {
      if (u) {
        this.nombreUsuario = u.Nombres || u.nombres || u.Nombre_Usuario;
        this.rolUsuario = u.Rol || u.rol || 'OPERADOR';

        this.esAdmin = this.rolUsuario === 'ADMIN';
      } else {
        this.router.navigate(['/login']);
      }
    });
  }
}
