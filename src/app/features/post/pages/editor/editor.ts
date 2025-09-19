import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PostsStore } from '../../store/posts.store';


@Component({
  selector: 'app-post-editor',
  standalone: true,
  imports: [
    CommonModule, RouterModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatChipsModule, MatButtonModule, MatIconModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    .container { max-width: 900px; margin-inline: auto; padding: 1rem; }
    .header { display:flex; align-items:center; justify-content:space-between; gap:.75rem; margin-bottom:1rem; }
    .title { font-size:1.5rem; font-weight:700; margin:0; }
    .panel { padding: 1rem; border-radius: var(--app-radius); border: var(--app-border); background: var(--app-surface); }
    .row { display:grid; gap:1rem; }
    .actions { display:flex; gap:.5rem; justify-content:flex-end; margin-top: .5rem; }
  `],
  template: `
    <section class="container">
      <div class="header surface-panel" style="padding:.75rem;">
        <h1 class="title">{{ editing() ? 'Edit Post' : 'New Post' }}</h1>
        <a mat-button routerLink="/posts">Back</a>
      </div>

      <form class="panel row" [formGroup]="form" (ngSubmit)="submit()">
        <mat-form-field appearance="outline">
          <mat-label>Title</mat-label>
          <input matInput formControlName="title" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Description</mat-label>
          <input matInput formControlName="description" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Body</mat-label>
          <textarea matInput rows="10" formControlName="body"></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Tags (comma separated)</mat-label>
          <input matInput formControlName="tagList" />
        </mat-form-field>

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
  readonly store = inject(PostsStore);
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly editing = signal(false);
  readonly slug = signal<string | null>(null);

  readonly form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    body: ['', Validators.required],
    tagList: [''],
  });

  constructor() {
    const s = this.route.snapshot.params['slug'];
    if (s) {
      this.editing.set(true);
      this.slug.set(s);
      this.store.loadOne(s);
      const t = setInterval(() => {
        const a = this.store.current?.();
        if (a) {
          this.form.patchValue({
            title: a.title,
            description: a.description,
            body: a.body ?? '',
            tagList: (a.tagList ?? []).join(', '),
          });
          clearInterval(t);
        }
      }, 50);
    }
  }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const v = this.form.value;
    const payload = {
      title: v.title!,
      description: v.description ?? '',
      body: v.body!,
      tagList: (v.tagList ?? '').split(',').map(x => x.trim()).filter(Boolean),
    };
    if (this.editing()) {
      const currentSlug = this.slug()!;
      this.store.updateOne(currentSlug, payload, (slug: string) => this.router.navigate(['/posts', slug]));
    } else {
      this.store.createOne(payload, (slug: string) => this.router.navigate(['/posts', slug]));
    }
  }
}
