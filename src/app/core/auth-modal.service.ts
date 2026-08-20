import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type AuthTab = 'login' | 'signup';

export interface AuthModalState {
  open: boolean;
  tab: AuthTab;
  resetToken?: string;
  resetTokenValid?: boolean;
}

/**
 * Any component can call openLogin() / openSignup() / close() to control the
 * auth modal without passing state through the component tree — e.g. the
 * header's "Sign up" button and the "Log in" account icon both use this.
 */
@Injectable({ providedIn: 'root' })
export class AuthModalService {
  private readonly stateSubject = new BehaviorSubject<AuthModalState>({
    open: false,
    tab: 'login',
  });
  readonly state$ = this.stateSubject.asObservable();

  openLogin(): void {
    this.stateSubject.next({ open: true, tab: 'login' });
  }

  openSignup(): void {
    this.stateSubject.next({ open: true, tab: 'signup' });
  }

  openResetPassword(token: string, valid: boolean): void {
    this.stateSubject.next({ open: true, tab: 'login', resetToken: token, resetTokenValid: valid });
  }

  close(): void {
    this.stateSubject.next({ ...this.stateSubject.value, open: false, resetToken: undefined });
  }
}
