import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {
  name = '';
  email = '';
  password = '';
  password_confirmation = ''; // A Laravel 'confirmed' szabálya ezt a nevet várja el!
  errorMessage = '';
  successMessage = '';

  constructor(private http: HttpClient, private router: Router) {}

  onRegister() {
    // Gyors front-end ellenőrzés a két jelszóra
    if (this.password !== this.password_confirmation) {
      this.errorMessage = 'A két jelszó nem egyezik meg!';
      return;
    }

    const registerData = {
      name: this.name,
      email: this.email,
      password: this.password,
      password_confirmation: this.password_confirmation
    };

    this.http.post('http://localhost:8000/api/register', registerData).subscribe({
      next: (response: any) => {
        this.errorMessage = '';
        this.successMessage = 'Sikeres regisztráció! Azonnal átirányítunk a bejelentkezéshez...';
        
        // 2 másodperc múlva át lökjük a Login oldalra
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        // Ha a Laravel validation hibát dob (pl. már létezik az email), itt elkapjuk
        this.successMessage = '';
        this.errorMessage = err.error.message || 'Sikertelen regisztráció! Ellenőrizd az adatokat.';
      }
    });
  }
}