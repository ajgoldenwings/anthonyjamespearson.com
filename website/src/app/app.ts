import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { Footer } from './components/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, Footer],
  templateUrl: './app.html'
})
export class App {
  protected readonly title = signal('website');
}
