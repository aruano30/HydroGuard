import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/usuarios'; 

  login(credenciales: { correo: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credenciales);
  }

  register(datosUsuario: { nombre: string; correo: string; password: string; idRol?: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, datosUsuario);
  }
}