import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Auth } from '../../auth';

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

  constructor(private http: HttpClient, private router: Router, private auth: Auth) {}

  onLogin() {
    this.errorMessage = '';
    const loginData = { email: this.email, password: this.password };

    this.http.post('http://localhost:8000/api/login', loginData).subscribe({
      next: (response: any) => {
        const token = response.access_token;
        
       
        const isAdmin = response.roles && response.roles.includes('admin');
        const role = isAdmin ? 'admin' : 'user';

        this.auth.login(token, role);

       
        if (isAdmin) {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/profile']);
        }
      },
      error: (err) => {
        
        this.errorMessage = err.error?.message || 'Hibás email vagy jelszó!';
      }
    });
  }
}