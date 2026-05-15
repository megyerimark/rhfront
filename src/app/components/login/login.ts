import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Auth } from '../../auth'; // Két szintet lépünk vissza (../../auth)

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  email = '';
  password = '';
  errorMessage = '';

  // A constructorban a te rövid Auth osztályodat kérjük be
  constructor(private http: HttpClient, private router: Router, private auth: Auth) {}

  onLogin() {
    const loginData = { email: this.email, password: this.password };

    this.http.post('http://localhost:8000/api/login', loginData).subscribe({
      next: (response: any) => {
        const token = response.access_token;

        const headers = { 'Authorization': `Bearer ${token}` };
        this.http.get('http://localhost:8000/api/me', { headers }).subscribe({
          next: (meResponse: any) => {
            const isAdmin = meResponse.roles.includes('admin');
            const role = isAdmin ? 'admin' : 'user';

            this.auth.login(token, role);

            if (isAdmin) {
              this.router.navigate(['/admin']);
            } else {
              this.router.navigate(['/profile']);
            }
          }
        });
      },
      error: (err) => {
        this.errorMessage = 'Hibás email vagy jelszó!';
      }
    });
  }
}