import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-account-card',
  standalone: true,
  templateUrl: './account-card.html'
})
export class AccountCard {
  @Input() title: string = '';
}
