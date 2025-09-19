import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { PostsStore } from '../../store/posts.store';
import { MarkdownPipe } from '@shared/pipes/markdown.pipe';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule, MatCardModule, MarkdownPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    .container { max-width: 900px; margin-inline: auto; padding: 1rem; }
    .header { display:flex; align-items:center; justify-content:space-between; gap:.75rem; margin-bottom:1rem; }
    .title { font-size:1.75rem; font-weight:700; letter-spacing:-.01em; margin:0; }
    .meta { opacity:.7; font-size:.85rem; display:flex; gap:.5rem; align-items:center; }
    .body { white-space: pre-line; line-height:1.7; font-size:1.02rem; }
    .panel { padding: 1rem; border-radius: var(--app-radius); border: var(--app-border); background: var(--app-surface); }
    .actions { display:flex; gap:.5rem; }
  `],
  template: `
    <section class="container">
      @if (store.current(); as c) {
        <div class="header">
          <h1 class="title">{{ c.title }}</h1>
          <div class="actions">
            <a mat-stroked-button color="primary" [routerLink]="['/editor', c.slug]">
              <mat-icon>edit</mat-icon> Edit
            </a>
            <button mat-stroked-button color="warn" (click)="onDelete(c.slug)" [disabled]="store.loading()">
              <mat-icon>delete</mat-icon> Delete
            </button>
            <a mat-button routerLink="/posts">Back</a>
          </div>
        </div>

        <div class="meta">
          <span>{{ c.author.username || '—' }}</span>
          <span>•</span>
          <span>{{ c.createdAt | date:'medium' }}</span>
        </div>

        <mat-card class="panel">
          <div class="prose" [innerHTML]="(c.body || c.description) | markdown"></div>
        </mat-card>
      } @else {
        <div class="panel">Loading…</div>
      }
    </section>
  `
})
export class PostDetailComponent {
  readonly store = inject(PostsStore);
  private dialog = inject(MatDialog);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  constructor() {
    const slug = this.route.snapshot.params['slug'];
    if (slug) this.store.loadOne(slug);
  }

  async onDelete(slug: string) {
    const ok = await this.dialog.open(ConfirmDialogComponent).afterClosed().toPromise();
    if (!ok) return;
    this.store.deleteOne(slug);
    this.router.navigate(['/posts']);
  }
}
