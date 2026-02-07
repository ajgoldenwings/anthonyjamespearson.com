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
  errorMessage = signal('');
  successMessage = signal('');
  isLoading = signal(false);
  signupComplete = signal(false);

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
      this.signupComplete.set(true);
    } else {
      this.errorMessage.set(result.message);
    }
  }

  async resendEmail(): Promise<void> {
    this.errorMessage.set('');
    this.isLoading.set(true);

    const result = await this.authService.resendVerificationEmail(this.email());

    this.isLoading.set(false);

    if (result.success) {
      this.successMessage.set(result.message);
    } else {
      this.errorMessage.set(result.message);
    }
  }

  goToLogin(): void {
    this.router.navigate(['/account/login']);
  }
}
