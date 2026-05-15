import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // Bejött a HttpHeaders!

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit {
  parties: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchParties();
  }

  fetchParties() {
    // Kiberheljük a tokent a böngészőből
    const token = localStorage.getItem('ravehouse_token');

    // Összerakjuk a fejlécet (ha nincs token, üresen megy, de a Laravel le fogja dobni)
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    // Elküldjük a GET kérést a fejléccel együtt!
    this.http.get('http://localhost:8000/api/events', { headers }).subscribe({
      next: (data: any) => {
        this.parties = data;
        console.log('Bulik sikeresen betöltve:', this.parties);
      },
      error: (err) => {
        console.error('Nem sikerült lekérni a bulikat:', err);
      }
    });
  }
}