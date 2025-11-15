import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

  constructor(private rutasPages: Router) {}

  mostrar_acerca_de() {
    this.rutasPages.navigate(['acerca-de']);
  }
  mostrar_iniciar_sesion() {
    this.rutasPages.navigate(['']);
  }
}
