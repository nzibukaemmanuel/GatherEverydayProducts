import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Form-group-level validator: attach to a FormGroup that has both a
 * password control and a confirm-password control. Adds a `passwordsMismatch`
 * error on the confirm control (not the group) so it's easy to show inline
 * under the confirm field.
 */
export function passwordsMatchValidator(passwordKey: string, confirmKey: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const password = group.get(passwordKey);
    const confirm = group.get(confirmKey);
    if (!password || !confirm) return null;

    if (confirm.value && password.value !== confirm.value) {
      confirm.setErrors({ ...confirm.errors, passwordsMismatch: true });
    } else if (confirm.errors) {
      const rest = { ...confirm.errors };
      delete rest['passwordsMismatch'];
      confirm.setErrors(Object.keys(rest).length ? rest : null);
    }
    return null;
  };
}

/** 0–3 strength score used to drive the strength meter in the UI. */
export function passwordStrength(value: string): number {
  if (!value) return 0;
  let score = 0;
  if (value.length >= 8) score++;
  if (/[A-Z]/.test(value) && /[0-9]/.test(value)) score++;
  if (value.length >= 12 || /[^A-Za-z0-9]/.test(value)) score++;
  return Math.min(score, 3);
}
