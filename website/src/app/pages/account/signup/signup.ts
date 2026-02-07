import { Component, signal, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './signup.html'
})
export class Signup {
  email = signal('');
  password = signal('');
  confirmPassword = signal('');
  verificationCode = signal('');
  errorMessage = signal('');
  successMessage = signal('');
  isLoading = signal(false);
  showVerification = signal(false);

  private authService = inject(AuthService);
  private router = inject(Router);

  async onSubmit(): Promise<void> {
    this.errorMessage.set('');
    this.successMessage.set('');

    if (this.password() !== this.confirmPassword()) {
      this.errorMessage.set('Passwords do not match');
      return;
    }

    if (this.password().length < 8) {
      this.errorMessage.set('Password must be at least 8 characters');
      return;
    }

    this.isLoading.set(true);

    const result = await this.authService.signUp(
      this.email(),
      this.password()
    );

    this.isLoading.set(false);

    if (result.success) {
      this.successMessage.set(result.message);
      this.showVerification.set(true);
    } else {
      this.errorMessage.set(result.message);
    }
  }

  async onVerify(): Promise<void> {
    this.errorMessage.set('');
    this.isLoading.set(true);

    const result = await this.authService.confirmSignUp(
      this.email(),
      this.verificationCode()
    );

    this.isLoading.set(false);

    if (result.success) {
      this.successMessage.set(result.message);
      setTimeout(() => {
        this.router.navigate(['/account/login']);
      }, 2000);
    } else {
      this.errorMessage.set(result.message);
    }
  }

  async resendCode(): Promise<void> {
    this.errorMessage.set('');
    this.isLoading.set(true);

    const result = await this.authService.resendConfirmationCode(this.email());

    this.isLoading.set(false);

    if (result.success) {
      this.successMessage.set(result.message);
    } else {
      this.errorMessage.set(result.message);
    }
  }
}
