import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  // Javítva az 'i' betű, és kapott egy ablak-ellenőrzést az SSR miatt!
  isLoggedIn = signal(typeof window !== 'undefined' ? !!localStorage.getItem('ravehouse_token') : false);
  isAdmin = signal(typeof window !== 'undefined' ? localStorage.getItem('ravehouse_role') === 'admin' : false);

  login(token: string, role: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ravehouse_token', token);
      localStorage.setItem('ravehouse_role', role);
    }
    
    this.isLoggedIn.set(true);
    this.isAdmin.set(role === 'admin');
  }

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ravehouse_token');
      localStorage.removeItem('ravehouse_role');
    }
    
    this.isLoggedIn.set(false);
    this.isAdmin.set(false);
  }
}