import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  errorMessage = '';

  loginForm: FormGroup = this.fb.group({
    correo: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  onLogin() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (response: any) => {
          console.log('Respuesta del servidor:', response);
          
          // Soporta tanto si el servidor devuelve { usuario: {...} } como si devuelve el objeto directo
          const usuarioData = response.usuario || response;
          localStorage.setItem('usuario', JSON.stringify(usuarioData));
          
          // Redirige directamente al dashboard
          this.router.navigate(['/dashboard']); 
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Correo o contraseña incorrectos';
        }
      });
    }
  }
}