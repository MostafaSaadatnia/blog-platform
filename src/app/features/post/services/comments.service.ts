import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { ApiService } from '@core/services/api.service';
import { CommentsResponse, CommentEnvelope } from '@shared/models/comment.model';

@Injectable({ providedIn: 'root' })
export class CommentsService {
  private api = inject(ApiService);

  list(slug: string) {
    return this.api
      .get<CommentsResponse>(`/articles/${slug}/comments`)
      .pipe(map((r) => r.comments));
  }

  add(slug: string, body: string) {
    return this.api
      .post<CommentEnvelope>(`/articles/${slug}/comments`, { comment: { body } })
      .pipe(map((r) => r.comment));
  }

  remove(slug: string, id: number) {
    return this.api.delete<void>(`/articles/${slug}/comments/${id}`);
  }
}
