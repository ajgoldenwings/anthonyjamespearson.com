import { Component, OnInit, inject } from '@angular/core';
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

  ngOnInit(): void {
    // if (!this.authService.isAuthenticated()) {
    //   this.router.navigate(['/account/login']);
    // }
  }

  onLogout(): void {
    this.authService.signOut();
    this.router.navigate(['/account/login']);
  }
}
