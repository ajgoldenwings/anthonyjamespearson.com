import { Component, signal, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './login.html'
})
export class Login {
  email = signal('');
  password = signal('');
  errorMessage = signal('');
  isLoading = signal(false);

  private authService = inject(AuthService);
  private router = inject(Router);

  async onSubmit(): Promise<void> {
    if (!this.email() || !this.password()) {
      this.errorMessage.set('Please enter email and password');
      return;
    }

    this.errorMessage.set('');
    this.isLoading.set(true);

    const result = await this.authService.signIn(
      this.email(),
      this.password()
    );

    this.isLoading.set(false);

    if (result.success) {
      this.router.navigate(['/account/settings']);
    } else {
      this.errorMessage.set(result.message);
    }
  }
}
