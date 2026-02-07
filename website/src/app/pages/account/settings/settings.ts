import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './settings.html'
})
export class Settings implements OnInit {
  authService = inject(AuthService);
  private router = inject(Router);
  isResending = signal(false);
  resendMessage = signal('');

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/account/login']);
    }
  }

  async resendVerificationEmail(): Promise<void> {
    const email = this.authService.currentUser()?.email;
    if (!email) return;

    this.isResending.set(true);
    this.resendMessage.set('');

    const result = await this.authService.resendVerificationEmail(email);

    this.isResending.set(false);
    this.resendMessage.set(result.message);

    // Clear message after 5 seconds
    setTimeout(() => {
      this.resendMessage.set('');
    }, 5000);
  }

  onLogout(): void {
    this.authService.signOut();
    this.router.navigate(['/account/login']);
  }
}
