import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ArticleDto } from '@/shared/models/article.model';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [CommonModule, DatePipe],
  template: `
  <article class="rounded-2xl border p-4 hover:shadow transition">
    <header class="mb-2">
      <h2 class="text-xl font-semibold">{{article.title}}</h2>
      <div class="text-sm opacity-70">
        by {{article.author.username}} • {{ article.createdAt | date:'mediumDate' }}
      </div>
    </header>
    <p class="mb-3">{{article.description}}</p>
    <footer class="flex items-center gap-3 text-sm opacity-75">
      <span>❤️ {{article.favoritesCount}}</span>
      <span class="inline-flex gap-1">
        <span *ngFor="let t of article.tagList" class="px-2 py-0.5 rounded bg-gray-100">{{t}}</span>
      </span>
    </footer>
  </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostCard {
  @Input({ required: true }) article!: ArticleDto;
}
