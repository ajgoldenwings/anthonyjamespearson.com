import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { About } from './pages/about/about';
import { Posts } from './pages/posts/posts';

export const routes: Routes = [
  { path: '', component: Home, title: "Home" },
  { path: 'about', component: About, title: "About" },
  { path: 'posts', component: Posts, title: "Posts" }
];
