import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule, MatChipInputEvent } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { PostsStore } from '../../store/posts.store';
import { applyServerErrors } from '@/shared/utils/form-errors.util';


@Component({
  selector: 'app-post-editor',
  standalone: true,
  imports: [
    CommonModule, RouterModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatChipsModule,
    MatButtonModule, MatIconModule, MatSnackBarModule, MatProgressBarModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    .container { max-width: 900px; margin-inline: auto; padding: 16px; }
    .bar { position: sticky; top: calc(64px + 0px); z-index: 2; background: var(--app-surface);
      border: var(--app-border); border-radius: var(--app-radius); padding: 12px; display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:12px; }
    .title { font-size: 1.1rem; font-weight: 700; margin: 0; }
    .panel { padding: 16px; border-radius: var(--app-radius); border: var(--app-border); background: var(--app-surface); display:grid; gap:16px; }
    .actions { display:flex; gap:8px; justify-content:flex-end; }
    .server-errors { border: var(--app-border); border-left: 4px solid var(--mdc-theme-error, #d32f2f); border-radius: var(--app-radius); padding: 12px; background: color-mix(in srgb, currentColor 8%, transparent); }
  `],
  template: `
    <section class="container">
      <div class="bar">
        <h1 class="title">{{ editing() ? 'Edit Post' : 'New Post' }}</h1>
        <div class="actions">
          <a mat-button routerLink="/posts">Back</a>
          <button mat-flat-button color="primary" (click)="submit()" [disabled]="form.invalid || store.loading()">Save</button>
        </div>
      </div>

      @if (store.loading()) {
        <mat-progress-bar mode="indeterminate"></mat-progress-bar>
      }

      @if (form.errors?.['server']) {
        <div class="server-errors">{{ form.errors?.['server'] }}</div>
      }

      <form class="panel" [formGroup]="form" (ngSubmit)="submit()">
        <mat-form-field appearance="outline">
          <mat-label>Title</mat-label>
          <input matInput formControlName="title" maxlength="120" />
          <mat-hint align="end">{{ form.get('title')?.value?.length || 0 }}/120</mat-hint>
          @if (form.get('title')?.touched && form.get('title')?.errors?.['required']) {
            <mat-error>Title is required</mat-error>
          }
          @if (form.get('title')?.touched && form.get('title')?.errors?.['minlength']) {
            <mat-error>Min 3 characters</mat-error>
          }
          @if (form.get('title')?.errors?.['server']) {
            <mat-error>{{ form.get('title')?.errors?.['server'] }}</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Description</mat-label>
          <input matInput formControlName="description" maxlength="240" />
          <mat-hint align="end">{{ form.get('description')?.value?.length || 0 }}/240</mat-hint>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Body</mat-label>
          <textarea matInput rows="12" formControlName="body"></textarea>
          @if (form.get('body')?.touched && form.get('body')?.errors?.['required']) {
            <mat-error>Body is required</mat-error>
          }
          @if (form.get('body')?.errors?.['server']) {
            <mat-error>{{ form.get('body')?.errors?.['server'] }}</mat-error>
          }
        </mat-form-field>

        <!-- Tags -->
        <div>
          <mat-chip-grid #chipGrid aria-label="Tags">
            @for (t of tags(); track t) {
              <mat-chip-row [removable]="true" (removed)="removeTag(t)">
                {{ t }}
                <button matChipRemove aria-label="Remove tag">
                  <mat-icon>close</mat-icon>
                </button>
              </mat-chip-row>
            }
          </mat-chip-grid>

          <mat-form-field appearance="outline" style="margin-top:.5rem; width:100%;">
            <mat-label>Add tag</mat-label>
            <input
              matInput
              [matChipInputFor]="chipGrid"
              [matChipInputSeparatorKeyCodes]="separatorKeys"
              (matChipInputTokenEnd)="addTag($event)"
              placeholder="Type a tag and press Enter" />
          </mat-form-field>
        </div>

        <div class="actions">
          <button mat-stroked-button type="button" routerLink="/posts">Cancel</button>
          <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid || store.loading()">
            {{ editing() ? 'Save changes' : 'Publish' }}
          </button>
        </div>
      </form>
    </section>
  `
})
export class PostEditorComponent {
  readonly store = inject(PostsStore) as InstanceType<typeof PostsStore>;
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly snack = inject(MatSnackBar);

  readonly editing = signal(false);
  readonly slug = signal<string | null>(null);
  readonly tags = signal<string[]>([]);
  readonly separatorKeys = [ENTER, COMMA] as const;

  readonly form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    body: ['', Validators.required],
  });

  constructor() {
    const s = this.route.snapshot.params['slug'];
    if (s) {
      this.editing.set(true);
      this.slug.set(s);
      this.store.loadOne(s);
    }
    effect(() => {
      const a = this.store.current();
      if (a && this.editing()) {
        this.form.patchValue({
          title: a.title,
          description: a.description,
          body: a.body ?? '',
        }, { emitEvent: false });
        this.tags.set((a.tagList ?? []).slice());
      }
    });
  }

  addTag(e: MatChipInputEvent) {
    const value = (e.value || '').trim();
    if (value && !this.tags().includes(value)) this.tags.set([...this.tags(), value]);
    e.chipInput?.clear();
  }
  removeTag(tag: string) { this.tags.set(this.tags().filter(t => t !== tag)); }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    this.form.setErrors(null);
    for (const key of Object.keys(this.form.controls)) {
      const c = this.form.get(key);
      if (c?.errors?.['server']) {
        const { server, ...rest } = c.errors!;
        c.setErrors(Object.keys(rest).length ? rest : null);
      }
    }

    const payload = {
      title: this.form.value.title!,
      description: this.form.value.description ?? '',
      body: this.form.value.body!,
      tagList: this.tags(),
    };

    const onError = (err: unknown) => {
      const msgs = applyServerErrors(this.form, err);
      if (msgs.length) this.snack.open(msgs[0], 'OK', { duration: 3000 });
    };

    if (this.editing()) {
      const currentSlug = this.slug()!;
      this.store.updateOne(currentSlug, payload,
        (slug) => { this.snack.open('Post updated', 'OK', { duration: 2000 }); this.router.navigate(['/posts', slug]); },
        onError
      );
    } else {
      this.store.createOne(payload,
        (slug) => { this.snack.open('Post created', 'OK', { duration: 2000 }); this.router.navigate(['/posts', slug]); },
        onError
      );
    }
  }
}