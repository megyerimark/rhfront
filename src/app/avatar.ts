import { Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// A felszerelés adatstruktúrája
export interface GearItem {
  id?: number;
  name: string;
  category: 'headgear' | 'top' | 'bottom' | 'accessory' | 'background';
  price: number;
  image_url?: string;
  model_url?: string; // A jövőbeli 3D modell (gltf/glb) elérhetősége
}

@Injectable({
  providedIn: 'root',
})
export class Avatar {
  private http = inject(HttpClient);

  // 🚨 SIGNAL: Ez tárolja a jelenleg viselt felszereléseket.
  // Bármelyik komponens rácsatlakozhat, és azonnal értesül a változásokról!
  equippedGear = signal<{ [key: string]: GearItem | null }>({
    headgear: null,
    top: null,
    bottom: null,
    accessory: null,
    background: null
  });

  constructor() {}

  // --- 🛠️ FELSZERELÉS FELVÉTELE ---
  equip(item: GearItem) {
    this.equippedGear.update(current => ({
      ...current,
      [item.category]: item // Felülírja az adott kategóriát az új tárggyal
    }));
    console.log(`[AVATAR_SYS] Új felszerelés csatlakoztatva: ${item.name} (${item.category})`);
  }

  // --- 🛠️ FELSZERELÉS LEVÉTELE ---
  unequip(category: string) {
    this.equippedGear.update(current => ({
      ...current,
      [category]: null
    }));
    console.log(`[AVATAR_SYS] Felszerelés leválasztva: ${category}`);
  }

  // --- 📡 SZINKRONIZÁCIÓ A LARAVEL BACKENDDEL ---
  saveLoadout() {
    if (typeof window === 'undefined') return;
    
    const token = localStorage.getItem('ravehouse_token');
    if (!token) {
      console.warn('[AVATAR_SYS] Nincs azonosító, a mentés megszakítva.');
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const payload = this.equippedGear();

    // ⚠️ Ezt a végpontot majd meg kell írnunk a Laravelben!
    /*
    this.http.post('http://localhost:8000/api/avatar/save', payload, { headers }).subscribe({
      next: () => console.log('[AVATAR_SYS] ⚡ Szett sikeresen szinkronizálva a központi adatbázissal!'),
      error: (err) => console.error('[AVATAR_SYS] ⚠️ Szinkronizációs hiba!', err)
    });
    */
  }
}