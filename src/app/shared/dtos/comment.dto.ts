import { AuthorDto } from '@shared/dtos/author.dto';

export interface CommentDto {
  id: number;
  createdAt: string;
  updatedAt: string;
  body: string;
  author: AuthorDto;
}
