import { Component, signal, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { SignupStateService } from '../../services/signup-state.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html'
})
export class Header {
  private router = inject(Router);
  protected readonly isMenuOpen = signal(false);
  private currentUrl = signal('');
  authService = inject(AuthService);
  private signupStateService = inject(SignupStateService);

  protected readonly isAccountActive = computed(() => {
    return this.currentUrl().startsWith('/account');
  });

  constructor() {
    // Set initial URL
    this.currentUrl.set(this.router.url);

    // Listen to route changes
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentUrl.set(event.urlAfterRedirects);
      });
  }

  protected toggleMenu(): void {
    this.isMenuOpen.set(!this.isMenuOpen());
  }

  protected closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  protected onSignInClick(): void {
    this.signupStateService.triggerReset();
  }
}
