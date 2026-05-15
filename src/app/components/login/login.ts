import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
email = '';
  password = '';
  errorMessage = '';

  constructor(private http: HttpClient, private router: Router) {}
  onLogin(){
    const loginData = {
      email: this.email,
      password: this.password
    }
    this.http.post('http://localhost:8000/api/login', loginData).subscribe({
      next: (response: any) => {
        // HA SIKERES:
        console.log('Sikeres belépés!', response);
        localStorage.setItem('ravehouse_token', response.access_token);
        this.router.navigate(['/']);
        },
        error: (err) => {
        // HA HIBA VAN (pl. rossz jelszó):
        console.error('Hiba történt:', err);
        this.errorMessage = 'Hibás email vagy jelszó!';
  }
    });
  }
}