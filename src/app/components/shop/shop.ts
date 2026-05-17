import { Component, OnInit, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shop.html',
  styleUrl: './shop.scss'
})
export class Shop implements OnInit {
  private http = inject(HttpClient);

  shopItems: any[] = [];
  userBalance: number = 0;
  
  loadingId: number | null = null;
  message: string = '';
  isError: boolean = false;

  ngOnInit() {
    this.fetchUserBalance();
    this.fetchShopItems();
  }

  // 1. Lekérjük a felhasználó adatait (hogy lássuk, mennyi RaveCoinja van)
  fetchUserBalance() {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('ravehouse_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get('http://localhost:8000/api/user', { headers }).subscribe({
      next: (res: any) => {
        this.userBalance = res.ravecoin_balance || 0;
      },
      error: (err) => console.error('Hiba az egyenleg lekérésekor', err)
    });
  }

fetchShopItems() {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('ravehouse_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // Itt is átadjuk a { headers } csomagot!
    this.http.get('http://localhost:8000/api/shop-items', { headers }).subscribe({
      next: (res: any) => {
        this.shopItems = res;
      },
      error: (err) => console.error('Hiba a tárgyak letöltésekor', err)
    });
  }

  // 3. Vásárlás indítása
  buyItem(itemId: number) {
    if (typeof window === 'undefined') return;
    this.loadingId = itemId;
    this.message = '';

    const token = localStorage.getItem('ravehouse_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.post(`http://localhost:8000/api/shop/${itemId}/buy`, {}, { headers }).subscribe({
      next: (res: any) => {
        this.loadingId = null;
        this.isError = false;
        this.message = res.message; // 'Sikeres tranzakció! ...'
        
        // Frissítjük a RaveCoin egyenleget a backend válasza alapján
        if (res.new_balance !== undefined) {
          this.userBalance = res.new_balance;
        }
      },
      error: (err) => {
        this.loadingId = null;
        this.isError = true;
        // A Laravel által küldött hibaüzenet (pl. "Nincs elég RaveCoinod")
        this.message = err.error.message || '⚠️ Hiba történt a tranzakció során.';
      }
    });
  }
}