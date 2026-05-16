import { Component, OnInit, inject, forwardRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth } from '../../auth'; 

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './admin.html',
  styleUrl: './admin.scss'
})
export class Admin implements OnInit {
  private http = inject(HttpClient);
  private auth = inject(forwardRef(() => Auth));
  private router = inject(Router);

  // Al-navbár lapfül vezérlő
  activeTab: string = 'dashboard'; 

  // Adatbázis listák
  users: any[] = [];
  filteredUsers: any[] = [];
  events: any[] = []; 
  searchQuery: string = '';

  // Statisztikák
  totalUsers: number = 0;
  adminCount: number = 0;
  verifiedUsers: number = 0;

  // Esemény generátor adatai
  loading = false;
  message = '';
  newEvent = {
    title: '',
    date: '',
    time: '22:00',
    description: '',
    embedded_media_url: ''
  };

  constructor() {}

  ngOnInit() {
    if (!this.auth.isAdmin()) {
      this.router.navigate(['/']);
      return;
    }
    this.fetchUsers();
    this.fetchEvents(); 
  }

  fetchUsers() {
    if (typeof window === 'undefined') return; 
    const token = localStorage.getItem('ravehouse_token'); 
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get('http://localhost:8000/api/users', { headers }).subscribe({
      next: (res: any) => {
        this.users = res;
        this.filteredUsers = res;
        this.calculateStats();
      },
      error: (err) => console.error('Hiba az adatok lekérésekor:', err)
    });
  }

  fetchEvents() {
    this.http.get('http://localhost:8000/api/events').subscribe({
      next: (res: any) => {
        this.events = res;
      },
      error: (err) => console.error('Hiba a bulik letöltésekor:', err)
    });
  }

  onCreateEvent() {
    if (typeof window === 'undefined') return;
    this.loading = true;
    this.message = '';

    const token = localStorage.getItem('ravehouse_token'); 
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const formattedDate = `${this.newEvent.date} ${this.newEvent.time}:00`;

    const payload: any = {
      title: this.newEvent.title,
      description: this.newEvent.description,
      event_date: formattedDate,
      embedded_media_url: null
    };

    if (this.newEvent.embedded_media_url && this.newEvent.embedded_media_url.trim() !== '') {
      payload.embedded_media_url = this.newEvent.embedded_media_url;
    }

    this.http.post('http://localhost:8000/api/events', payload, { headers }).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.message = '»» RAVE GENERÁTOR AKTIVÁLVA // ÚJ FREKVENCIA SIKERESEN ÉLESÍTVE A MÁTRIXBAN! ⚡🔊';
        this.newEvent = { title: '', date: '', time: '22:00', description: '', embedded_media_url: '' };
        this.fetchEvents(); 
      },
      error: (err) => {
        this.loading = false;
        this.message = '⚠️ RENDSZERHIBA: A PLAZMAHÁLÓZAT MEGSZAKADT. ELLENŐRIZD A MEZŐKET!';
        console.error(err);
      }
    });
  }

  calculateStats() {
    this.totalUsers = this.users.length;
    this.adminCount = this.users.filter(u => u.roles && u.roles.includes('admin')).length;
    this.verifiedUsers = this.users.filter(u => u.email_verified_at !== null).length;
  }

  onSearch() {
    const query = this.searchQuery.toLowerCase();
    this.filteredUsers = this.users.filter(user => 
      user.name.toLowerCase().includes(query) || 
      user.email.toLowerCase().includes(query)
    );
  }
}