import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [],
  templateUrl: './verify.html',
  styleUrl: './verify.scss'
})
export class Verify implements OnInit {
  message = 'Megerősítés folyamatban... ⛓️';
  isError = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    // SSR védelem: csak a böngészőben futtatjuk
    if (typeof window === 'undefined') return;

    // Kiszedjük az ID-t és a Hash-t az útvonalból
    const id = this.route.snapshot.paramMap.get('id');
    const hash = this.route.snapshot.paramMap.get('hash');
    
    // Nyersen elkérjük a teljes query stringet (?expires=...&signature=...)
    const rawQueryString = window.location.search; 

    // Összerakjuk a pontos backend végpontot
    const laravelUrl = `http://localhost:8000/api/email/verify/${id}/${hash}${rawQueryString}`;

    // Elküldjük a kérést a Laravelnek
    this.http.get(laravelUrl).subscribe({
      next: (response: any) => {
        this.message = '✓ Fiókod sikeresen aktiválva! Azonnal átirányítunk a bejelentkezéshez...';
        this.isError = false;
        
        // 3 másodperc múlva át lökjük a Login oldalra
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (err) => {
        this.message = '⚠️ A megerősítési link érvénytelen vagy lejárt!';
        this.isError = true;
      }
    });
  }
}