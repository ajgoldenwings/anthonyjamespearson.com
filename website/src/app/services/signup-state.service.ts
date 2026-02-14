import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SignupStateService {
  private resetSignupTrigger = signal(0);

  // Observable that components can subscribe to
  getResetTrigger() {
    return this.resetSignupTrigger;
  }

  // Method to trigger reset
  triggerReset() {
    this.resetSignupTrigger.update(v => v + 1);
  }
}
