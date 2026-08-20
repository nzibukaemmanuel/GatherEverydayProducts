import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { IconComponent } from '../icon/icon.component';
import { AuthModalService, AuthModalState, AuthTab } from '../../core/auth-modal.service';
import { AuthService } from '../../core/auth.service';
import { passwordsMatchValidator, passwordStrength } from '../../core/password-match.validator';

type View = 'auth' | 'forgot';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IconComponent],
  templateUrl: './auth-modal.component.html',
  styleUrl: './auth-modal.component.css',
})
export class AuthModalComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly authModal = inject(AuthModalService);
  private readonly authService = inject(AuthService);

  modalState: AuthModalState = { open: false, tab: 'login' };
  view: View = 'auth';
  activeTab: AuthTab = 'login';
  forgotStep = 1;
  resetEmail = '';
  resetToken: string | null = null;

  loginError: string | null = null;
  loginNotice: string | null = null;
  signupError: string | null = null;
  signupSubmitting = false;
  resendDisabled = false;
  forgotError: string | null = null;
  resetError: string | null = null;

  // password visibility toggles, keyed per field
  visibility: Record<string, boolean> = {};

  private sub?: Subscription;

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  signupForm = this.fb.group(
    {
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirm: ['', Validators.required],
      terms: [false, Validators.requiredTrue],
    },
    { validators: passwordsMatchValidator('password', 'confirm') },
  );

  forgotForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  resetForm = this.fb.group(
    {
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirm: ['', Validators.required],
    },
    { validators: passwordsMatchValidator('password', 'confirm') },
  );

  ngOnInit(): void {
    this.sub = this.authModal.state$.subscribe((state) => {
      this.modalState = state;
      if (state.open) {
        if (state.resetToken) {
          this.view = 'forgot';
          this.resetToken = state.resetToken;
          this.resetError = null;
          this.forgotStep = state.resetTokenValid ? 3 : 5;
        } else {
          this.view = 'auth';
          this.activeTab = state.tab;
          this.loginNotice = null;
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  close(): void {
    this.authModal.close();
  }

  onOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }

  setTab(tab: AuthTab): void {
    this.activeTab = tab;
    this.loginError = null;
    this.loginNotice = null;
    this.signupError = null;
  }

  toggleVisibility(field: string): void {
    this.visibility[field] = !this.visibility[field];
  }

  inputType(field: string): string {
    return this.visibility[field] ? 'text' : 'password';
  }

  signupStrength(): number {
    return passwordStrength(this.signupForm.get('password')?.value || '');
  }

  resetStrength(): number {
    return passwordStrength(this.resetForm.get('password')?.value || '');
  }

  /* ---------- login ---------- */
  onLoginSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.loginError = null;
    this.loginNotice = null;
    const { email, password } = this.loginForm.value;
    this.authService.login(email!, password!).subscribe({
      next: () => this.close(),
      error: (err) => {
        this.loginError = err.error?.message || 'Incorrect email or password — try again.';
      },
    });
  }

  /* ---------- signup ---------- */
  onSignupSubmit(): void {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }
    this.signupError = null;
    this.signupSubmitting = true;
    const { name, email, password } = this.signupForm.value;
    this.authService.signup(name!, email!, password!).subscribe({
      next: () => {
        this.signupSubmitting = false;
        this.signupForm.reset();
        this.activeTab = 'login';
        this.loginError = null;
        this.loginNotice = 'Account created — log in to continue.';
        this.loginForm.patchValue({ email });
      },
      error: (err) => {
        this.signupSubmitting = false;
        this.signupError = err.error?.message || 'Something went wrong creating your account.';
      },
    });
  }

  /* ---------- forgot password ---------- */
  openForgot(): void {
    this.view = 'forgot';
    this.forgotStep = 1;
  }

  backToLogin(): void {
    this.view = 'auth';
    this.activeTab = 'login';
    this.loginError = null;
    this.resetToken = null;
    this.forgotError = null;
    this.resetError = null;
  }

  goStep(step: number): void {
    this.forgotStep = step;
  }

  onForgotEmailSubmit(): void {
    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched();
      return;
    }
    this.forgotError = null;
    this.resetEmail = this.forgotForm.value.email ?? '';
    this.authService.forgotPassword(this.resetEmail).subscribe({
      next: () => (this.forgotStep = 2),
      error: (err) => {
        this.forgotError = err.error?.message || 'Something went wrong. Try again.';
      },
    });
  }

  resendLink(): void {
    this.resendDisabled = true;
    this.authService.forgotPassword(this.resetEmail).subscribe();
    setTimeout(() => (this.resendDisabled = false), 2500);
  }

  onResetSubmit(): void {
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }
    if (!this.resetToken) {
      this.forgotStep = 5;
      return;
    }
    this.resetError = null;
    const { password } = this.resetForm.value;
    this.authService.resetPassword(this.resetToken, password!).subscribe({
      next: () => (this.forgotStep = 4),
      error: (err) => {
        if (err.status === 400) {
          this.forgotStep = 5;
        } else {
          this.resetError = err.error?.message || 'Something went wrong. Try again.';
        }
      },
    });
  }
}
