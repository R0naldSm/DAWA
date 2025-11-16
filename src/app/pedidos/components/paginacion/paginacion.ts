import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-paginacion',
  imports: [RouterLink],
  templateUrl: './paginacion.html',
  styleUrl: './paginacion.css',
})
export class Paginacion {
  pagina = input.required<number>()
  totalPaginas = input.required<number>()
}
