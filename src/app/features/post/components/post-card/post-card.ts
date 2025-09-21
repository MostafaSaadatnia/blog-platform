import { Component, Input, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { PostsStore } from '@features/post/store/posts.store';
import { ArticleDto } from '@shared/dtos/article.dto';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatChipsModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .card-elevate {
        border: var(--app-border);
        border-radius: var(--app-radius);
        transition:
          box-shadow 0.2s,
          border-color 0.2s,
          transform 0.06s;
      }
      .card-elevate:hover {
        transform: translateY(-1px);
        border: var(--app-border-strong);
        box-shadow: var(--mat-elevation-level4);
      }

      .pager-outlined {
        border: var(--app-border);
        border-radius: var(--app-radius);
        padding: 2px;
        background: var(--app-surface);
      }

      .card {
        border-radius: var(--app-radius);
        border: var(--app-border);
        transition:
          box-shadow 0.2s ease,
          transform 0.08s ease,
          border-color 0.2s;
        background: var(--app-surface);
      }
      .card:hover {
        box-shadow: var(--mat-elevation-level4);
        transform: translateY(-1px);
        border: var(--app-border-strong);
      }
      .title {
        font-size: 1rem;
        font-weight: 600;
        line-height: 1.35;
        margin: 0;
      }
      .subtitle {
        display: inline-flex;
        gap: 0.5rem;
        opacity: 0.7;
        font-size: 0.78rem;
      }
      .desc {
        margin: 0.25rem 0 0;
        opacity: 0.85;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      .chev {
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
        opacity: 0.8;
      }
      .favorite-actions {
        position: absolute;
        margin-top: 14px;
        display: flex;
        gap: 4px;
      }
      .mat-mdc-card-header {
        height: 78px;
      }
    `,
  ],
  template: `
    <mat-card class="card" (click)="onCardClick($event)">
      <mat-card-header>
        <mat-card-title class="title">{{ article.title }}</mat-card-title>
        <mat-card-subtitle class="subtitle">
          <span>{{ article.author.username ? article.author.username : '—' }}</span>
          <span>•</span>
          <span>{{ article.createdAt | date: 'mediumDate' }}</span>
        </mat-card-subtitle>
      </mat-card-header>

      @if (article.description) {
        <mat-card-content>
          <p class="desc">{{ article.description }}</p>
        </mat-card-content>
      }

      @if (article.tagList.length) {
        <mat-card-content>
          <mat-chip-set class="h-[80px]" aria-label="tags">
            @for (t of article.tagList; track t) {
              <mat-chip>{{ t }}</mat-chip>
            }
          </mat-chip-set>

          <div class="favorite-actions">
            <button mat-icon-button (click)="fav($event)" aria-label="Favorite">
              <mat-icon>{{ article.favorited ? 'favorite' : 'favorite_border' }}</mat-icon>
              <span class="sr-only">Favorite</span>
            </button>
            <span>{{ article.favoritesCount ? article.favoritesCount : 0 }}</span>
          </div>
        </mat-card-content>
      }

      <mat-card-actions align="end">
        <span class="chev">Read <mat-icon aria-hidden="true">chevron_right</mat-icon></span>
      </mat-card-actions>
    </mat-card>
  `,
})
export class PostCardComponent {
  @Input({ required: true }) article!: ArticleDto;

  store = inject(PostsStore);
  private router = inject(Router);

  onCardClick(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.router.navigate(['/posts', this.article.slug]);
  }
  fav(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    this.store.toggleFavorite(this.article.slug);
  }
}
