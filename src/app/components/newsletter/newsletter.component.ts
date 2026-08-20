import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-newsletter',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './newsletter.component.html',
  styleUrl: './newsletter.component.css',
})
export class NewsletterComponent {
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  constructor(private readonly fb: FormBuilder) {}

  get email() {
    return this.form.controls.email;
  }

  subscribe(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    // Demo only — a real implementation would POST to a subscriptions endpoint.
    alert('Subscribed — demo only.');
    this.form.reset();
  }
}
