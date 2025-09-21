import { ArticleDto } from '@shared/dtos/article.dto';

export interface ArticlesResponse {
  articles: ArticleDto[];
  articlesCount: number;
}
