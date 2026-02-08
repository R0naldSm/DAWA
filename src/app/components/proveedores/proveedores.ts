import { ProveedorService } from '../../services/proveedorService';
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
  proveedoresFiltrados: any[] = []; // Lista COMPLETA filtrada (Activos o Eliminados)

  // --- VARIABLES DE PAGINACIÓN ---
  paginaActual: number = 1;
  itemsPorPagina: number = 5;

  buscarTexto: string = '';
  nombreUsuario: string = '';
  verInactivos: boolean = false;

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
    this.proveedorService.getProveedores(this.buscarTexto, this.verInactivos).subscribe({
      next: (data) => {
        const listaCompleta = data.map((p: any) => ({
          id: p.IdProveedor || p.idProveedor,
          nombre: p.Nombre || p.nombre,
          ruc: p.Ruc || p.ruc,
          categoria: p.Categoria || p.categoria,
          telefono: p.Telefono || p.telefono,
          email: p.Email || p.email,
          direccion: p.Direccion || p.direccion,
          estado: p.Estado !== undefined ? p.Estado : p.estado
        }));

        // Filtramos la lista completa
        if (this.verInactivos) {
           this.proveedoresFiltrados = listaCompleta.filter(p => p.estado === 0 || p.estado === false);
        } else {
           this.proveedoresFiltrados = listaCompleta.filter(p => p.estado === 1 || p.estado === true);
        }

        // Reiniciamos a la página 1 cuando cargan nuevos datos
        this.paginaActual = 1;
      },
      error: (e) => console.error('Error al cargar proveedores:', e)
    });
  }

  // --- LÓGICA DE PAGINACIÓN ---

  // Esto es lo que verá la tabla (solo 5 registros)
  get proveedoresPaginados() {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    return this.proveedoresFiltrados.slice(inicio, fin);
  }

  // Calcular total de páginas
  get totalPaginas() {
    return Math.ceil(this.proveedoresFiltrados.length / this.itemsPorPagina) || 1;
  }

  cambiarPagina(delta: number) {
    const nuevaPagina = this.paginaActual + delta;
    if (nuevaPagina >= 1 && nuevaPagina <= this.totalPaginas) {
      this.paginaActual = nuevaPagina;
    }
  }

// Validaciones
  validarFormulario(): boolean {
    const { ruc, telefono, email, nombre, categoria } = this.datosFormulario;

    if (!nombre || !categoria) {
      alert("La Razón Social y la Categoría son obligatorios.");
      return false;
    }

    if (!ruc) { alert("El RUC es obligatorio."); return false; }
    if (ruc.length !== 13) { alert(`El RUC debe tener exactamente 13 dígitos. (Tiene ${ruc.length})`); return false; }
    if (!ruc.endsWith("001")) { alert("El RUC debe terminar obligatoriamente en '001'."); return false; }

    if (telefono) {
      if (telefono.length !== 10) { alert(`El Teléfono debe tener exactamente 10 dígitos.`); return false; }
    }

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) { alert("Formato de correo inválido."); return false; }
    }

    return true;
  }

  soloNumeros(event: any) {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) return false;
    return true;
  }


  toggleVista() {
    this.cargarProveedores();
  }

  buscar() {
    this.cargarProveedores();
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
    if (!this.validarFormulario()) return;

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
        alert('Eliminado correctamente');
        this.cargarProveedores();
      },
      error: (e) => alert('Error al eliminar')
    });
  }

  reactivar(p: any) {
    if(!confirm(`¿Desea reactivar al proveedor ${p.nombre}?`)) return;
    const proveedorActivo = { ...p, IdProveedor: p.id, estado: 1 };

    this.proveedorService.gestionar(proveedorActivo, 'EDITAR').subscribe({
      next: () => {
        alert('Proveedor reactivado exitosamente');
        this.cargarProveedores();
      },
      error: () => alert('Error al reactivar')
    });
  }

  cerrarModal() { this.mostrarModal = false; }
  volver() { this.router.navigate(['/principal']); }
}
