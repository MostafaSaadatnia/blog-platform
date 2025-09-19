import { AuthorDto } from './article.model';

export interface CommentDto {
  id: number;
  createdAt: string;
  updatedAt: string;
  body: string;
  author: AuthorDto;
}

export interface CommentsResponse {
  comments: CommentDto[];
}


export interface ProfileDto {
  username: string;
  image?: string | null;
}

export interface CommentsResponse {
  comments: CommentDto[];
}

export interface CommentEnvelope {
  comment: CommentDto;
}