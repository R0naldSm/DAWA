import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Aboutof } from './components/aboutof/aboutof';

export const routes: Routes = [
  { path: '', component: Login },
  { path: 'acerca-de', component: Aboutof },
  { path: '**', redirectTo: '' }
];
