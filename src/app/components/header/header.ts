import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UsuarioServicio } from '../../services/usuario-servicio';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export default class Header {
  constructor(private rutasPages: Router, protected usuarioServicio: UsuarioServicio) {}

  mostrar_acerca_de() {
    this.rutasPages.navigate(['acerca-de']);
  }
  mostrar_iniciar_sesion() {
    this.rutasPages.navigate(['']);
  }

  cerrarSesion(){
    this.usuarioServicio.usuarioLogueado = false;
  }
}
