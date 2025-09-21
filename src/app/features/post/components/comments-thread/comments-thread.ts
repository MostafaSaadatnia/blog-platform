import { ChangeDetectionStrategy, Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommentsStore } from '@features/post/store/comments.store';

@Component({
  selector: 'app-comments-thread',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .wrap {
        display: grid;
        gap: 12px;
      }
      .editor {
        border: var(--app-border);
        border-radius: var(--app-radius);
        background: var(--app-surface);
        padding: 12px;
      }
      .list {
        display: grid;
        gap: 8px;
      }
      .item {
        border: var(--app-border);
        border-radius: var(--app-radius);
        background: var(--app-surface);
        padding: 12px;
      }
      .meta {
        font-size: 0.8rem;
        opacity: 0.75;
        display: flex;
        gap: 0.5rem;
        align-items: center;
        margin: 1rem 0.5rem;
      }
      .author {
        font-weight: 600;
      }
      .body {
        white-space: pre-line;
        margin-top: 0.35rem;
        line-height: 1.6;
      }
      .row {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        justify-content: space-between;
      }
      .empty {
        opacity: 0.7;
        font-size: 0.9rem;
        padding: 8px;
        text-align: center;
      }
    `,
  ],
  template: `
    <div class="wrap">
      @if (canPost) {
        <div class="editor">
          <form [formGroup]="form" (ngSubmit)="submit()">
            <mat-form-field appearance="outline" class="w-full" style="width:100%;">
              <mat-label>Write a comment</mat-label>
              <textarea
                matInput
                rows="3"
                formControlName="body"
                placeholder="Share your thoughts…"
              ></textarea>
              @if (form.get('body')?.touched && form.get('body')?.invalid) {
                <mat-error>Comment is required</mat-error>
              }
            </mat-form-field>
            <div class="row">
              <span class="meta" style="visibility:hidden">.</span>
              <button
                mat-flat-button
                color="primary"
                type="submit"
                [disabled]="form.invalid || store.posting()"
              >
                Post
              </button>
            </div>
          </form>
        </div>
      }

      @if (store.loading()) {
        <div class="item">
          <mat-progress-spinner diameter="24" mode="indeterminate"></mat-progress-spinner>
        </div>
      } @else {
        <div class="list">
          @if (store.items().length === 0) {
            <div class="empty">No comments yet.</div>
          } @else {
            @for (c of store.items(); track c.id) {
              <div class="item">
                <div class="row">
                  <div class="meta">
                    <span class="author">{{ c.author.username }}</span>
                    <span>•</span>
                    <span>{{ c.createdAt | date: 'medium' }}</span>
                  </div>
                  @if (allowDelete) {
                    <button
                      mat-icon-button
                      color="warn"
                      [disabled]="store.deletingId() === c.id"
                      (click)="onDelete(c.id)"
                      aria-label="Delete comment"
                    >
                      <mat-icon>delete</mat-icon>
                    </button>
                  }
                </div>
                <div class="body">{{ c.body }}</div>
              </div>
            }
          }
        </div>
      }
    </div>
  `,
})
export class CommentsThreadComponent implements OnInit {
  @Input({ required: true }) slug!: string;

  @Input() canPost = true;
  @Input() allowDelete = true;

  readonly store = inject(CommentsStore);
  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.group({
    body: ['', Validators.required],
  });

  ngOnInit(): void {
    this.store.load(this.slug);
  }

  submit() {
    if (this.form.invalid) return;
    const v = this.form.value.body!.trim();
    if (!v) return;
    this.store.add(v);
    this.form.reset({ body: '' });
  }

  onDelete(id: number) {
    this.store.remove(id);
  }
}
