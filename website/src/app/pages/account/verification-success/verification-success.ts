import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AccountCard } from '../../../components/account-card/account-card';

@Component({
  selector: 'app-verification-success',
  standalone: true,
  imports: [RouterLink, AccountCard],
  templateUrl: './verification-success.html'
})
export class VerificationSuccess {}
