import { Routes } from '@angular/router';
import { Home} from './components/home/home';
import { Login } from './components/login/login';
import { Admin } from './components/admin/admin';     
import { Profile } from './components/profile/profile'; 
//import { Shop } from './components/shop/shop';
import { Register } from './components/register/register';
import { Verify } from './components/verify/verify';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
 //{ path: 'shop', component: Shop },
  { path: 'admin', component: Admin },    
  { path: 'profile', component: Profile }, 
{ path: 'register', component: Register },
{ path: 'email/verify/:id/:hash', component: Verify },










  { path: '**', redirectTo: '' }, //legutolsó!

 
];