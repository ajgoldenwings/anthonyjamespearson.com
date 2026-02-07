import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  CognitoIdentityProviderClient,
  SignUpCommand,
  InitiateAuthCommand,
  GetUserCommand,
  ResendConfirmationCodeCommand,
  AuthFlowType
} from '@aws-sdk/client-cognito-identity-provider';
import { environment } from '../../environments/environment';

export interface User {
  email: string;
  emailVerified: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private client: CognitoIdentityProviderClient;
  private accessToken = signal<string | null>(null);
  public currentUser = signal<User | null>(null);
  public isAuthenticated = signal<boolean>(false);
  private platformId = inject(PLATFORM_ID);
  private isBrowser: boolean;

  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.client = new CognitoIdentityProviderClient({
      region: environment.aws.region
    });
    this.loadSession();
  }

  private loadSession(): void {
    if (!this.isBrowser) return;

    const token = localStorage.getItem('accessToken');
    if (token) {
      this.accessToken.set(token);
      this.isAuthenticated.set(true);
      this.loadUserInfo();
    }
  }

  async signUp(email: string, password: string): Promise<{ success: boolean; message: string }> {
    try {
      const command = new SignUpCommand({
        ClientId: environment.aws.userPoolClientId,
        Username: email,
        Password: password,
        UserAttributes: [
          {
            Name: 'email',
            Value: email
          }
        ]
      });

      await this.client.send(command);
      return {
        success: true,
        message: 'Sign up successful! Please check your email for a verification link.'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Sign up failed'
      };
    }
  }

  async resendVerificationEmail(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const command = new ResendConfirmationCodeCommand({
        ClientId: environment.aws.userPoolClientId,
        Username: email
      });

      await this.client.send(command);
      return {
        success: true,
        message: 'Verification email resent. Please check your inbox.'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to resend verification email'
      };
    }
  }

  async signIn(email: string, password: string): Promise<{ success: boolean; message: string }> {
    try {
      const command = new InitiateAuthCommand({
        AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
        ClientId: environment.aws.userPoolClientId,
        AuthParameters: {
          USERNAME: email,
          PASSWORD: password
        }
      });

      const response = await this.client.send(command);

      if (response.AuthenticationResult?.AccessToken) {
        const token = response.AuthenticationResult.AccessToken;
        this.accessToken.set(token);
        this.isAuthenticated.set(true);

        if (this.isBrowser) {
          localStorage.setItem('accessToken', token);
        }

        await this.loadUserInfo();

        return {
          success: true,
          message: 'Login successful!'
        };
      }

      return {
        success: false,
        message: 'Login failed'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Login failed'
      };
    }
  }

  async loadUserInfo(): Promise<void> {
    const token = this.accessToken();
    if (!token) return;

    try {
      const command = new GetUserCommand({
        AccessToken: token
      });

      const response = await this.client.send(command);
      const emailAttr = response.UserAttributes?.find((attr: any) => attr.Name === 'email');
      const emailVerifiedAttr = response.UserAttributes?.find((attr: any) => attr.Name === 'email_verified');

      this.currentUser.set({
        email: emailAttr?.Value || '',
        emailVerified: emailVerifiedAttr?.Value === 'true'
      });
    } catch (error) {
      console.error('Failed to load user info:', error);
      this.signOut();
    }
  }

  signOut(): void {
    this.accessToken.set(null);
    this.currentUser.set(null);
    this.isAuthenticated.set(false);

    if (this.isBrowser) {
      localStorage.removeItem('accessToken');
    }
  }
}
