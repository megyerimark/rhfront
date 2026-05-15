import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
    // HA A SZERVEREN FUT A KÓD, AZONNAL LÉPJEN KI (Így nem omlik össze a localStorage hiánya miatt)
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('ravehouse_token');

    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    });

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