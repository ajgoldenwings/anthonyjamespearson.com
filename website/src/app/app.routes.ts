import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { About } from './pages/about/about';
import { Articles } from './pages/articles/articles';
import { ArticleDetail } from './pages/article-detail/article-detail';
import { Privacy } from './pages/privacy/privacy';
import { Login } from './pages/account/login/login';
import { Signup } from './pages/account/signup/signup';
import { Settings } from './pages/account/settings/settings';
import { articleTitleResolver } from './resolvers/article-title.resolver';

export const routes: Routes = [
  { path: '', component: Home, title: "Anthony – Home" },
  { path: 'about', component: About, title: "Anthony – About" },
  { path: 'articles', component: Articles, title: "Anthony – Articles" },
  {
    path: 'articles/:id',
    component: ArticleDetail,
    title: articleTitleResolver
  },
  { path: 'privacy', component: Privacy, title: "Anthony – Privacy Policy" },
  { path: 'account/login', component: Login, title: "Anthony – Login" },
  { path: 'account/signup', component: Signup, title: "Anthony – Sign Up" },
  { path: 'account/settings', component: Settings, title: "Anthony – Settings" }
];
