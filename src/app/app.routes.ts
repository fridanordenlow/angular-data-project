import { Routes } from '@angular/router';
import { Home } from './home/home-page';
import { Flights } from './features/flights-feature/pages/flights-page/flights';

export const routes: Routes = [
  { path: '', component: Home, pathMatch: 'full', title: 'Home page' },
  { path: 'flights', component: Flights, title: 'Flights page' },
];
