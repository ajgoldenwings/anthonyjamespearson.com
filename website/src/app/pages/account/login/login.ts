import { Component, signal, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './login.html'
})
export class Login {
  // Signal-based form fields
  email = signal('');
  password = signal('');

  // UI state signals
  errorMessage = signal('');
  isLoading = signal(false);

  // Validation signals
  emailValid = signal(true);
  passwordValid = signal(true);

  private authService = inject(AuthService);
  private router = inject(Router);

  // Validate email format
  validateEmail(): void {
    const emailValue = this.email();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.emailValid.set(emailValue === '' || emailRegex.test(emailValue));
  }

  // Validate password is not empty
  validatePassword(): void {
    const passwordValue = this.password();
    this.passwordValid.set(passwordValue !== '');
  }

  async onSubmit(): Promise<void> {
    console.log('🚀 Login onSubmit called', {
      email: this.email(),
      hasPassword: !!this.password()
    });

    this.errorMessage.set('');

    // Validate fields
    this.validateEmail();
    this.validatePassword();

    if (!this.email() || !this.emailValid()) {
      console.log('❌ Invalid email');
      this.errorMessage.set('Please enter a valid email address');
      return;
    }

    if (!this.password()) {
      console.log('❌ Password required');
      this.errorMessage.set('Please enter your password');
      return;
    }

    console.log('📋 Form validation passed, calling auth service...');
    this.isLoading.set(true);

    const result = await this.authService.signIn(
      this.email(),
      this.password()
    );

    this.isLoading.set(false);

    if (result.success) {
      console.log('✅ Login successful, redirecting to settings...');
      this.router.navigate(['/account/settings']);
    } else {
      console.log('❌ Login failed:', result.message);
      this.errorMessage.set(result.message);
    }
  }
}
