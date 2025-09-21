import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CommentsService } from './comments.service';
import { CommentsResponse, CommentEnvelope } from '@shared/models/comment.model';

describe('CommentsService', () => {
  let svc: CommentsService;
  let http: HttpTestingController;

  const base = 'https://api.realworld.show/api';
  const url = (p: string) => `${base}${p}`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CommentsService],
    });
    svc = TestBed.inject(CommentsService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('list should GET /articles/:slug/comments and map to comments[]', () => {
    let res: any[] | undefined;
    svc.list('my-slug').subscribe((r) => (res = r));

    const req = http.expectOne(url('/articles/my-slug/comments'));
    expect(req.request.method).toBe('GET');

    const payload: CommentsResponse = {
      comments: [
        { id: 1, body: 'Hi', createdAt: '', author: { username: 'a' } },
        { id: 2, body: 'Hello', createdAt: '', author: { username: 'b' } },
      ] as any,
    };
    req.flush(payload);

    expect(res).toBeTruthy();
    expect(res!.length).toBe(2);
    expect(res![0].id).toBe(1);
    expect(res![1].body).toBe('Hello');
  });

  it('add should POST { comment: { body } } and map to comment', () => {
    let res: any | undefined;
    svc.add('abc', 'Nice post').subscribe((r) => (res = r));

    const req = http.expectOne(url('/articles/abc/comments'));
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ comment: { body: 'Nice post' } });

    const payload: CommentEnvelope = {
      comment: { id: 10, body: 'Nice post', createdAt: '', author: { username: 'me' } } as any,
    };
    req.flush(payload);

    expect(res).toBeTruthy();
    expect(res!.id).toBe(10);
    expect(res!.body).toBe('Nice post');
  });

  it('remove should DELETE /articles/:slug/comments/:id', () => {
    let completed = false;
    svc.remove('abc', 99).subscribe({ complete: () => (completed = true) });

    const req = http.expectOne(url('/articles/abc/comments/99'));
    expect(req.request.method).toBe('DELETE');
    req.flush(null);

    expect(completed).toBe(true);
  });
});
