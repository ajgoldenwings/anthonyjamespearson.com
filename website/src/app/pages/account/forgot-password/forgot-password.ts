import { Component, signal, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './forgot-password.html'
})
export class ForgotPassword {
  email = signal('');
  errorMessage = signal('');
  successMessage = signal('');
  isLoading = signal(false);
  emailSent = signal(false);
  emailValid = signal(true);

  private authService = inject(AuthService);
  private router = inject(Router);

  validateEmail(): void {
    const emailValue = this.email();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.emailValid.set(emailValue === '' || emailRegex.test(emailValue));
  }

  async onSubmit(): Promise<void> {
    this.errorMessage.set('');
    this.successMessage.set('');

    this.validateEmail();

    if (!this.email() || !this.emailValid()) {
      this.errorMessage.set('Please enter a valid email address');
      return;
    }

    this.isLoading.set(true);

    const result = await this.authService.forgotPassword(this.email());

    this.isLoading.set(false);

    if (result.success) {
      this.successMessage.set(result.message);
      this.emailSent.set(true);
    } else {
      this.errorMessage.set(result.message);
    }
  }

  async resendEmail(): Promise<void> {
    const emailValue = this.email();
    if (!emailValue) return;

    this.errorMessage.set('');
    this.isLoading.set(true);

    const result = await this.authService.forgotPassword(emailValue);

    this.isLoading.set(false);

    if (result.success) {
      this.successMessage.set(result.message);
    } else {
      this.errorMessage.set(result.message);
    }
  }
}
