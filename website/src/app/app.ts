import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Header, Footer],
  templateUrl: './app.html'
})
export class App {
  protected readonly title = signal('website');

  protected closeDrawer(): void {
    const drawer = document.getElementById('site-drawer') as HTMLInputElement;
    if (drawer) {
      drawer.checked = false;
    }
  }
}
