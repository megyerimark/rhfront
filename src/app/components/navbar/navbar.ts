import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { Auth } from '../../auth'; // Két szintet lépünk vissza ide is!

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {
  
  constructor(public auth: Auth, private router: Router) {}

  onLogout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}