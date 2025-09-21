import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { ApiService } from '@core/services/api.service';
import { ArticlesResponse } from '@shared/models/article-response.model';
import { ArticleDto } from '@shared/dtos/article.dto';

@Injectable({ providedIn: 'root' })
export class ArticleService {
  private api = inject(ApiService);

  getArticles(page = 1, pageSize = 10) {
    const limit = pageSize;
    const offset = (page - 1) * pageSize;
    return this.api.get<ArticlesResponse>('/articles', { limit, offset });
  }

  getArticle(slug: string) {
    return this.api.get<{ article: ArticleDto }>(`/articles/${slug}`).pipe(map((r) => r.article));
  }

  createArticle(article: Partial<ArticleDto>) {
    return this.api
      .post<{ article: ArticleDto }>(`/articles`, { article })
      .pipe(map((r) => r.article));
  }

  updateArticle(slug: string, article: Partial<ArticleDto>) {
    return this.api
      .put<{ article: ArticleDto }>(`/articles/${slug}`, { article })
      .pipe(map((r) => r.article));
  }

  deleteArticle(slug: string) {
    return this.api.delete<void>(`/articles/${slug}`);
  }

  favorite(slug: string) {
    return this.api
      .post<{ article: ArticleDto }>(`/articles/${slug}/favorite`, {})
      .pipe(map((r) => r.article));
  }

  unfavorite(slug: string) {
    return this.api
      .delete<{ article: ArticleDto }>(`/articles/${slug}/favorite`)
      .pipe(map((r) => r.article));
  }
}
