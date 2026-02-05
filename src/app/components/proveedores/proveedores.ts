import { ProveedorService } from '../../services/proveedorService';
import { Proveedor } from '../../interfaces/proveedor';
import { AuthService } from '../../services/auth';
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-proveedores',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './proveedores.html',
  styleUrls: ['./proveedores.css']
})
export class Proveedores implements OnInit {

  private proveedorService = inject(ProveedorService);
  private auth = inject(AuthService);
  private router = inject(Router);

  proveedores: any[] = [];

  buscarTexto: string = '';
  nombreUsuario: string = '';

  mostrarModal: boolean = false;
  modoEdicion: boolean = false;

  datosFormulario: any = {
    id: 0, ruc: '', nombre: '', telefono: '',
    email: '', categoria: '', direccion: '', contacto: ''
  };

  ngOnInit() {
    this.auth.usuarioActual$.subscribe(u => {
      if (u) this.nombreUsuario = u.Nombres || u.Nombres;
      else this.router.navigate(['/']);
    });

    this.cargarProveedores();
  }

  cargarProveedores() {
    this.proveedorService.getProveedores(this.buscarTexto).subscribe({
      next: (data) => {
        this.proveedores = data.map((p: any) => ({
          id: p.IdProveedor || p.idProveedor,
          nombre: p.Nombre || p.nombre,
          ruc: p.Ruc || p.ruc,
          categoria: p.Categoria || p.categoria,
          telefono: p.Telefono || p.telefono,
          email: p.Email || p.email,
          direccion: p.Direccion || p.direccion
        }));
      },
      error: (e) => console.error('Error al cargar proveedores:', e)
    });
  }

  get proveedoresFiltrados() {
    return this.proveedores;
  }

  abrirModalCrear() {
    this.modoEdicion = false;
    this.datosFormulario = { id:0, ruc:'', nombre:'', telefono:'', email:'', categoria:'', direccion:'' };
    this.mostrarModal = true;
  }

  abrirModalEditar(p: any) {
    this.modoEdicion = true;
    this.datosFormulario = { ...p };
    this.mostrarModal = true;
  }

  guardarProveedor() {
    const accion = this.modoEdicion ? 'EDITAR' : 'INSERTAR';

    this.proveedorService.gestionar(this.datosFormulario, accion).subscribe({
      next: (res) => {
        alert('Operación exitosa');
        this.cerrarModal();
        this.cargarProveedores();
      },
      error: (err) => alert('Error al guardar: ' + (err.error?.error || err.message))
    });
  }

  eliminar(id: number) {
    if (!confirm('¿Seguro que desea eliminar?')) return;

    const p = { IdProveedor: id };

    this.proveedorService.gestionar(p, 'ELIMINAR').subscribe({
      next: () => {
        alert('Eliminado');
        this.cargarProveedores();
      },
      error: (e) => alert('Error al eliminar')
    });
  }

  buscar() {
    this.cargarProveedores();
  }

  cerrarModal() { this.mostrarModal = false; }
  volver() { this.router.navigate(['/principal']); }
}
