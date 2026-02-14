import { Component, signal, inject, effect, untracked } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { SignupStateService } from '../../../services/signup-state.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './signup.html'
})
export class Signup {
  // Signal-based form fields
  email = signal('');
  password = signal('');
  confirmPassword = signal('');

  // UI state signals
  errorMessage = signal('');
  successMessage = signal('');
  isLoading = signal(false);
  signupComplete = signal(false);

  // Computed validation signals
  emailValid = signal(true);
  passwordValid = signal(true);
  confirmPasswordValid = signal(true);

  private authService = inject(AuthService);
  private router = inject(Router);
  private signupStateService = inject(SignupStateService);

  constructor() {
    // Use effect to watch for reset triggers
    effect(() => {
      // This will run whenever the reset trigger changes
      var resetSignupTrigger = this.signupStateService.getResetTrigger();
      console.log(`Effect triggered. Current resetSignupTrigger: ${resetSignupTrigger}`);

      untracked(() => {
        if (this.signupComplete()) {
          this.resetForm();
        }
      });
    });
  }

  private resetForm(): void {
    // Reset all form fields
    this.email.set('');
    this.password.set('');
    this.confirmPassword.set('');

    // Reset validation states
    this.emailValid.set(true);
    this.passwordValid.set(true);
    this.confirmPasswordValid.set(true);

    // Reset alerts and UI state
    this.errorMessage.set('');
    this.successMessage.set('');
    this.isLoading.set(false);
    this.signupComplete.set(false);
  }

  // Validate email format
  validateEmail(): void {
    const emailValue = this.email();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.emailValid.set(emailValue === '' || emailRegex.test(emailValue));
  }

  // Validate password length
  validatePassword(): void {
    const passwordValue = this.password();
    this.passwordValid.set(passwordValue === '' || passwordValue.length >= 8);
  }

  // Validate password match
  validateConfirmPassword(): void {
    const confirmValue = this.confirmPassword();
    this.confirmPasswordValid.set(
      confirmValue === '' || confirmValue === this.password()
    );
  }

  async onSubmit(): Promise<void> {
    console.log('🚀 onSubmit method called!', {
      email: this.email(),
      hasPassword: !!this.password()
    });

    this.errorMessage.set('');
    this.successMessage.set('');

    // Validate all fields
    this.validateEmail();
    this.validatePassword();
    this.validateConfirmPassword();

    // Check if email is valid
    if (!this.email() || !this.emailValid()) {
      console.log('❌ Invalid email');
      this.errorMessage.set('Please enter a valid email address');
      return;
    }

    // Check if password is valid
    if (!this.password() || !this.passwordValid()) {
      console.log('❌ Invalid password');
      this.errorMessage.set('Password must be at least 8 characters');
      return;
    }

    // Check if passwords match
    if (this.password() !== this.confirmPassword()) {
      console.log('❌ Password mismatch');
      this.errorMessage.set('Passwords do not match');
      return;
    }

    console.log('📋 Form validation passed, calling auth service...');
    this.isLoading.set(true);

    const result = await this.authService.signUp(
      this.email(),
      this.password()
    );

    this.isLoading.set(false);

    console.log('📥 Signup result:', result);

    if (result.success) {
      if (result.autoLogin) {
        console.log('✅ Signup successful with auto-login, redirecting to settings...');
        this.router.navigate(['/account/settings']);
      } else {
        console.log('✅ Signup successful, showing verification screen');
        this.successMessage.set(result.message);
        this.signupComplete.set(true);
      }
    } else {
      console.log('❌ Signup failed:', result.message);
      this.errorMessage.set(result.message);
    }
  }

  async resendEmail(): Promise<void> {
    const emailValue = this.email();
    if (!emailValue) return;

    this.errorMessage.set('');
    this.isLoading.set(true);

    const result = await this.authService.resendVerificationEmail(emailValue);

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
