import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ArticleService } from './article.service';
import { ArticlesResponse, ArticleDto } from '@shared/models/article.model';

describe('ArticleService', () => {
  let svc: ArticleService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ArticleService],
    });
    svc = TestBed.inject(ArticleService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  function fullUrl(path: string, qp?: Record<string, string | number>) {
    const base = 'https://api.realworld.show/api';
    if (!qp) return `${base}${path}`;
    const usp = new URLSearchParams(Object.entries(qp).map(([k, v]) => [k, String(v)]));
    return `${base}${path}?${usp.toString()}`;
  }

  it('getArticles should request with limit/offset and return payload', () => {
    const page = 2, pageSize = 5;
    const expectedUrl = fullUrl('/articles', { limit: pageSize, offset: (page - 1) * pageSize });
    let result: ArticlesResponse | undefined;

    svc.getArticles(page, pageSize).subscribe(r => (result = r));
    const req = http.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');

    const article: ArticleDto = { slug: 's', title: 'T', description: 'D', body: 'B', tagList: [], createdAt: '', updatedAt: '', author: { username: 'u' } };
    req.flush({ articles: [article], articlesCount: 1 } satisfies ArticlesResponse);

    expect(result).toBeTruthy();
    expect(result!.articles.length).toBe(1);
    expect(result!.articles[0].slug).toBe('s');
    expect(result!.articlesCount).toBe(1);
  });

  it('getArticle should map {article} envelope', () => {
    let res: ArticleDto | undefined;
    svc.getArticle('abc').subscribe(r => (res = r));

    const req = http.expectOne(fullUrl('/articles/abc'));
    expect(req.request.method).toBe('GET');

    const payload: ArticleDto = { slug: 'abc', title: 'Hello', description: 'd', body: 'b', tagList: ['x'], createdAt: '', updatedAt: '', author: { username: 'u' } };
    req.flush({ article: payload });

    expect(res).toBeTruthy();
    expect(res!.slug).toBe('abc');
    expect(res!.title).toBe('Hello');
  });

  it('createArticle should POST body wrapped in {article} and map envelope', () => {
    const input: Partial<ArticleDto> = { title: 'New', body: 'Body', description: 'Desc', tagList: ['a'] };
    let res: ArticleDto | undefined;

    svc.createArticle(input).subscribe(r => (res = r));

    const req = http.expectOne(fullUrl('/articles'));
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ article: input });

    const created: ArticleDto = { slug: 'new-slug', title: 'New', description: 'Desc', body: 'Body', tagList: ['a'], createdAt: '', updatedAt: '', author: { username: 'u' } };
    req.flush({ article: created });

    expect(res).toBeTruthy();
    expect(res!.slug).toBe('new-slug');
  });

  it('updateArticle should PUT body wrapped and map envelope', () => {
    const patch = { title: 'Updated' };
    let res: ArticleDto | undefined;

    svc.updateArticle('slug-1', patch).subscribe(r => (res = r));

    const req = http.expectOne(fullUrl('/articles/slug-1'));
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ article: patch });

    const updated: ArticleDto = { slug: 'slug-1', title: 'Updated', description: '', body: '', tagList: [], createdAt: '', updatedAt: '', author: { username: 'u' } };
    req.flush({ article: updated });

    expect(res).toBeTruthy();
    expect(res!.title).toBe('Updated');
  });

  it('deleteArticle should issue DELETE', () => {
    let completed = false;
    svc.deleteArticle('to-del').subscribe({ complete: () => (completed = true) });

    const req = http.expectOne(fullUrl('/articles/to-del'));
    expect(req.request.method).toBe('DELETE');
    req.flush(null);

    expect(completed).toBe(true);
  });
});
