import { Component, signal, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reset-password.html'
})
export class ResetPassword implements OnInit {
  email = signal('');
  code = signal('');
  password = signal('');
  confirmPassword = signal('');
  errorMessage = signal('');
  successMessage = signal('');
  isLoading = signal(false);
  resetComplete = signal(false);

  passwordValid = signal(true);
  confirmPasswordValid = signal(true);
  passwordError = signal('');

  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    // Get email and code from query params if provided
    this.route.queryParams.subscribe(params => {
      if (params['email']) {
        this.email.set(params['email']);
      }
      if (params['code']) {
        this.code.set(params['code']);
      }
    });
  }

  validatePassword(): void {
    const passwordValue = this.password();

    if (passwordValue === '') {
      this.passwordValid.set(true);
      return;
    }

    // Check minimum length
    if (passwordValue.length < 8) {
      this.passwordValid.set(false);
      this.passwordError.set('Password must be at least 8 characters');
      return;
    }

    // Check for uppercase
    if (!/[A-Z]/.test(passwordValue)) {
      this.passwordValid.set(false);
      this.passwordError.set('Password must contain at least one uppercase letter');
      return;
    }

    // Check for lowercase
    if (!/[a-z]/.test(passwordValue)) {
      this.passwordValid.set(false);
      this.passwordError.set('Password must contain at least one lowercase letter');
      return;
    }

    // Check for digit
    if (!/\d/.test(passwordValue)) {
      this.passwordValid.set(false);
      this.passwordError.set('Password must contain at least one number');
      return;
    }

    // Check for symbol
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(passwordValue)) {
      this.passwordValid.set(false);
      this.passwordError.set('Password must contain at least one symbol');
      return;
    }

    this.passwordValid.set(true);
    this.passwordError.set('');
  }

  validateConfirmPassword(): void {
    const confirmValue = this.confirmPassword();
    this.confirmPasswordValid.set(
      confirmValue === '' || confirmValue === this.password()
    );
  }

  async onSubmit(): Promise<void> {
    this.errorMessage.set('');
    this.successMessage.set('');

    // Validate all fields
    this.validatePassword();
    this.validateConfirmPassword();

    if (!this.email()) {
      this.errorMessage.set('Email is required');
      return;
    }

    if (!this.code()) {
      this.errorMessage.set('Verification code is required');
      return;
    }

    if (!this.password() || !this.passwordValid()) {
      this.errorMessage.set(this.passwordError() || 'Please enter a valid password');
      return;
    }

    if (this.password() !== this.confirmPassword()) {
      this.errorMessage.set('Passwords do not match');
      return;
    }

    this.isLoading.set(true);

    const result = await this.authService.confirmForgotPassword(
      this.email(),
      this.code(),
      this.password()
    );

    this.isLoading.set(false);

    if (result.success) {
      this.successMessage.set(result.message);
      this.resetComplete.set(true);
    } else {
      this.errorMessage.set(result.message);
    }
  }

  goToLogin(): void {
    this.router.navigate(['/account/login']);
  }
}
