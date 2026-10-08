import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IncidentService } from '../../services/incident';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  usuarioActual: any = {};
  incidentForm: FormGroup;
  incidents: any[] = [];

  constructor(
    private fb: FormBuilder,
    private incidentService: IncidentService,
    private router: Router,
    private cdr: ChangeDetectorRef // <-- 1. Inyectamos el detector de cambios
  ) {
    this.incidentForm = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      ubicacion: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Validamos que estemos en el navegador antes de usar localStorage (Evita errores de SSR)
    if (typeof window !== 'undefined' && window.localStorage) {
      const usuarioGuardado = localStorage.getItem('usuario');
      if (usuarioGuardado) {
        this.usuarioActual = JSON.parse(usuarioGuardado);
      } else {
        this.router.navigate(['/login']);
        return;
      }
    }

    this.cargarIncidencias();
  }

  esAdmin(): boolean {
    return this.usuarioActual && this.usuarioActual.idRol === 1;
  }

  cargarIncidencias(): void {
    this.incidentService.getIncidents().subscribe({
      next: (data) => {
        this.incidents = Array.isArray(data) ? [...data] : [];
        this.cdr.detectChanges(); // <-- 2. Forzamos a Angular a actualizar la vista de inmediato
      },
      error: (err) => {
        console.error('Error al cargar incidencias:', err);
      }
    });
  }

  onSubmit(): void {
    if (this.incidentForm.invalid) return;

    const nuevaIncidencia = {
      titulo: this.incidentForm.value.titulo,
      descripcion: this.incidentForm.value.descripcion,
      ubicacion: this.incidentForm.value.ubicacion,
      idUsuario: this.usuarioActual.idUsuario || this.usuarioActual.id
    };

    this.incidentService.createIncident(nuevaIncidencia).subscribe({
      next: () => {
        this.incidentForm.reset();
        Object.keys(this.incidentForm.controls).forEach(key => {
          this.incidentForm.get(key)?.setErrors(null);
        });
        this.cargarIncidencias(); // Recargamos la lista y la pintamos al instante
      },
      error: (err) => {
        console.error('Error al registrar la incidencia:', err);
      }
    });
  }

  cambiarEstado(inc: any): void {
    const nuevoEstado = inc.idEstado === 1 ? 2 : 1;

    this.incidentService.updateStatus(inc.idIncidencia, nuevoEstado).subscribe({
      next: () => {
        inc.idEstado = nuevoEstado;
        this.cdr.detectChanges(); // <-- 3. Forzamos actualización visual al cambiar estado
      },
      error: (err) => {
        console.error('Error al actualizar el estado:', err);
        alert('No se pudo actualizar el estado en el servidor.');
      }
    });
  }

  obtenerNombreUsuario(idUsuario: number): string {
    const usuariosConocidos: { [key: number]: string } = {
      1: 'Ariel Ruano',
      2: 'Elías Pérez',
      3: 'Carlos Gómez',
    };
    return usuariosConocidos[idUsuario] || `Usuario #${idUsuario}`;
  }

  cerrarSesion(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('usuario');
    }
    this.router.navigate(['/login']);
  }

  get totalReportes(): number {
    return this.incidents.length;
  }

  get totalPendientes(): number {
    return this.incidents.filter(inc => inc.idEstado !== 2).length;
  }

  get totalResueltos(): number {
    return this.incidents.filter(inc => inc.idEstado === 2).length;
  }
}