import { Routes } from '@angular/router';
import { Home} from './components/home/home';
import { Login } from './components/login/login';
import { Admin } from './components/admin/admin';     // Új import
import { Profile } from './components/profile/profile'; // Új import
//import { Shop } from './components/shop/shop';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
 //{ path: 'shop', component: Shop },
  { path: 'admin', component: Admin },     // Új útvonal
  { path: 'profile', component: Profile }, // Új útvonal
  { path: '**', redirectTo: '' }
];