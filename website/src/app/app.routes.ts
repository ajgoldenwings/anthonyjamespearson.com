import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { About } from './pages/about/about';
import { Articles } from './pages/articles/articles';

export const routes: Routes = [
  { path: '', component: Home, title: "Home" },
  { path: 'about', component: About, title: "About" },
  { path: 'articles', component: Articles, title: "Articles" }
];
