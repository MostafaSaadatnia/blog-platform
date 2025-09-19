import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { ArticleDto } from '@/shared/models/article.model';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatChipsModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
  /* cards */
.card-elevate { border: var(--app-border); border-radius: var(--app-radius); transition: box-shadow .2s, border-color .2s, transform .06s; }
.card-elevate:hover { transform: translateY(-1px); border: var(--app-border-strong); box-shadow: var(--mat-elevation-level4); }

/* paginator wrapper */
.pager-outlined { border: var(--app-border); border-radius: var(--app-radius); padding: 2px; background: var(--app-surface); }

    .card { border-radius: var(--app-radius); border: var(--app-border); transition: box-shadow .2s ease, transform .08s ease, border-color .2s; background: var(--app-surface); }
    .card:hover { box-shadow: var(--mat-elevation-level4); transform: translateY(-1px); border: var(--app-border-strong); }
    .title { font-size: 1rem; font-weight: 600; line-height: 1.35; margin: 0; }
    .subtitle { display: inline-flex; gap: .5rem; opacity: .7; font-size: .78rem; }
    .desc { margin: .25rem 0 0; opacity: .85; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .chev { display: inline-flex; align-items: center; gap: .25rem; opacity: .8; }
  `],
  template: `
    <a [routerLink]="['/posts', article.slug]" style="text-decoration:none; color:inherit;">
      <mat-card class="card">
        <mat-card-header>
          <mat-card-title class="title">{{ article.title }}</mat-card-title>
          <mat-card-subtitle class="subtitle">
            <span>{{ article.author.username ? article.author.username : '—' }}</span>
            <span>•</span>
            <span>{{ article.createdAt | date:'mediumDate' }}</span>
          </mat-card-subtitle>
        </mat-card-header>

        @if (article.description) {
          <mat-card-content>
            <p class="desc">{{ article.description }}</p>
          </mat-card-content>
        }

        @if (article.tagList.length) {
          <mat-card-content>
            <mat-chip-set aria-label="tags">
              @for (t of article.tagList; track t) {
                <mat-chip>{{ t }}</mat-chip>
              }
            </mat-chip-set>
          </mat-card-content>
        }

        <mat-card-actions align="end">
          <span class="chev">Read <mat-icon aria-hidden="true">chevron_right</mat-icon></span>
        </mat-card-actions>
      </mat-card>
    </a>
  `
})
export class PostCardComponent {
  @Input({ required: true }) article!: ArticleDto;
}