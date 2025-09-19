export interface AuthorDto {
  username: string;
  image?: string;
  following: boolean;
}

export interface ArticleDto {
  slug: string;
  title: string;
  description: string;
  body?: string;
  tagList: string[];
  createdAt: string;
  updatedAt: string;
  author: { username: string };
}

export interface ArticlesResponse {
  articles: ArticleDto[];
  articlesCount: number;
}
