import { ArticleDto } from '@shared/dtos/article.dto';

export interface PostsState {
  page: number;
  pageSize: number;
  total: number;
  loading: boolean;
  error: string | null;
  articles: ArticleDto[];
  current: ArticleDto | null;
}
