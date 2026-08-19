import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { IconComponent } from '../icon/icon.component';
import { AuthModalService, AuthModalState, AuthTab } from '../../core/auth-modal.service';
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

  modalState: AuthModalState = { open: false, tab: 'login' };
  view: View = 'auth';
  activeTab: AuthTab = 'login';
  forgotStep = 1;
  resetEmail = '';

  // demo-only UI state
  loginError = false;
  signupSubmitting = false;
  resendDisabled = false;

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
        this.view = 'auth';
        this.activeTab = state.tab;
      }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  close(): void {
    this.authModal.close();
  }

  setTab(tab: AuthTab): void {
    this.activeTab = tab;
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
    this.close();
    alert('Logged in — demo only. In production this would redirect to the account or homepage.');
  }

  previewLoginError(): void {
    this.loginError = true;
  }

  /* ---------- signup ---------- */
  onSignupSubmit(): void {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }
    this.signupSubmitting = true;
    setTimeout(() => {
      this.signupSubmitting = false;
      this.close();
      alert('Account created — demo only. In production this would redirect to a welcome screen.');
    }, 900);
  }

  /* ---------- forgot password ---------- */
  openForgot(): void {
    this.view = 'forgot';
    this.forgotStep = 1;
  }

  backToLogin(): void {
    this.view = 'auth';
    this.activeTab = 'login';
    this.loginError = false;
  }

  goStep(step: number): void {
    this.forgotStep = step;
  }

  onForgotEmailSubmit(): void {
    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched();
      return;
    }
    this.resetEmail = this.forgotForm.value.email ?? '';
    this.forgotStep = 2;
  }

  resendLink(): void {
    this.resendDisabled = true;
    setTimeout(() => (this.resendDisabled = false), 2500);
  }

  onResetSubmit(): void {
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }
    this.forgotStep = 4;
  }
}
