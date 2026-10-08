import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IncidentService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getIncidents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/incidents`);
  }

  createIncident(incidentData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/incidents`, incidentData);
  }

  // Método para actualizar el estado de la incidencia (PUT)
  updateStatus(idIncidencia: number, idEstado: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/incidents/${idIncidencia}/status`, { idEstado });
  }
}