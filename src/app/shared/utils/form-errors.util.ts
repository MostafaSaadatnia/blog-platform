import { AbstractControl, FormGroup } from '@angular/forms';
import { ServerErrors } from '@shared/types/server-errors.type';

export function applyServerErrors(form: FormGroup, payload: ServerErrors): string[] {
  const messages: string[] = [];

  const dict: Record<string, string[]> = (() => {
    if (payload?.errors && typeof payload.errors === 'object') {
      const out: Record<string, string[]> = {};
      for (const [k, v] of Object.entries(payload.errors)) {
        out[k] = Array.isArray(v) ? v : [String(v)];
      }
      return out;
    }
    if (payload?.error?.errors) return payload.error.errors;
    return {};
  })();

  for (const [key, errs] of Object.entries(dict)) {
    const ctrl: AbstractControl | null = form.get(key);
    const msg = errs.join(', ');
    messages.push(`${key}: ${msg}`);
    if (ctrl) {
      const next = { ...(ctrl.errors ?? {}), server: msg };
      ctrl.setErrors(next);
      ctrl.markAsTouched();
    }
  }

  if (!messages.length && (payload?.message || payload?.error?.message)) {
    messages.push(String(payload.message ?? payload.error?.message));
  }

  if (messages.length) {
    const next = { ...(form.errors ?? {}), server: messages.join(' • ') };
    form.setErrors(next);
  }
  return messages;
}
