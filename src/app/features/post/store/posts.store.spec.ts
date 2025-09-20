import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { PostsStore } from './posts.store';
import { ArticleService } from '@features/post/services/article.service';
import { ArticleDto } from '@shared/models/article.model';

function article(overrides: Partial<ArticleDto> = {}): ArticleDto {
  return {
    slug: 'hello-world',
    title: 'Hello World',
    description: 'desc',
    body: 'body',
    tagList: ['tag'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    author: { username: 'u' },
    ...overrides,
  };
}

describe('PostsStore', () => {
  let store: InstanceType<typeof PostsStore>;
  let api: {
    getArticles: ReturnType<typeof vi.fn>;
    getArticle: ReturnType<typeof vi.fn>;
    createArticle: ReturnType<typeof vi.fn>;
    updateArticle: ReturnType<typeof vi.fn>;
    deleteArticle: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    api = {
      getArticles: vi.fn(),
      getArticle: vi.fn(),
      createArticle: vi.fn(),
      updateArticle: vi.fn(),
      deleteArticle: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [{ provide: ArticleService, useValue: api }],
    });

    store = TestBed.inject(PostsStore) as any;
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('loadPage success', () => {
    api.getArticles.mockReturnValue(of({ articles: [article()], articlesCount: 1 }));
    store.loadPage(1, 10);
    expect(store.loading()).toBe(false);
    expect(store.error()).toBeNull();
    expect(store.page()).toBe(1);
    expect(store.pageSize()).toBe(10);
    expect(store.total()).toBe(1);
    expect(store.articles().length).toBe(1);
    expect(store.articles()[0].slug).toBe('hello-world');
    expect(api.getArticles).toHaveBeenCalledWith(1, 10);
  });

  it('loadPage error', () => {
    api.getArticles.mockReturnValue(throwError(() => new Error('boom')));
    store.loadPage(2, 5);
    expect(store.loading()).toBe(false);
    expect(store.error()).toBe('boom');
    expect(store.page()).toBe(2);
    expect(store.pageSize()).toBe(5);
    expect(store.articles().length).toBe(0);
  });

  it('loadOne success', () => {
    api.getArticle.mockReturnValue(of(article({ slug: 's1', title: 'T1' })));
    store.loadOne('s1');
    expect(store.loading()).toBe(false);
    expect(store.error()).toBeNull();
    expect(store.current()!.slug).toBe('s1');
    expect(api.getArticle).toHaveBeenCalledWith('s1');
  });

  it('loadOne error', () => {
    api.getArticle.mockReturnValue(throwError(() => new Error('nope')));
    store.loadOne('missing');
    expect(store.loading()).toBe(false);
    expect(store.error()).toBe('nope');
    expect(store.current()).toBeNull();
  });

  it('createOne success and onDone callback', () => {
    const created = article({ slug: 'new-slug', title: 'New' });
    api.createArticle.mockReturnValue(of(created));
    api.getArticles.mockReturnValue(of({ articles: [created], articlesCount: 1 }));
    const onDone = vi.fn();
    store.createOne({ title: 'New', body: 'B' }, onDone);
    expect(store.loading()).toBe(false);
    expect(store.error()).toBeNull();
    expect(store.current()!.slug).toBe('new-slug');
    expect(onDone).toHaveBeenCalledWith('new-slug');
  });

  it('createOne error with onError', () => {
    const err = new Error('create-failed');
    api.createArticle.mockReturnValue(throwError(() => err));
    const onError = vi.fn();
    store.createOne({ title: 'X' }, undefined, onError);
    expect(store.loading()).toBe(false);
    expect(store.error()).toBe('create-failed');
    expect(onError).toHaveBeenCalledWith(err);
  });

  it('updateOne success updates list and current and calls onDone', () => {
    const a1 = article({ slug: 'a1', title: 'A1' });
    const a2 = article({ slug: 'a2', title: 'A2' });
    api.updateArticle.mockReturnValue(of({ ...a2, title: 'A2x' }));
    (store as any).articles.set([a1, a2]);
    const onDone = vi.fn();
    store.updateOne('a2', { title: 'A2x' }, onDone);
    expect(store.loading()).toBe(false);
    expect(store.error()).toBeNull();
    expect(store.articles().find(x => x.slug === 'a2')!.title).toBe('A2x');
    expect(store.current()!.title).toBe('A2x');
    expect(onDone).toHaveBeenCalledWith('a2');
  });

  it('updateOne error triggers onError and keeps loading false', () => {
    api.updateArticle.mockReturnValue(throwError(() => new Error('update-failed')));
    const onError = vi.fn();
    store.updateOne('z', { title: 'Z' }, undefined, onError);
    expect(store.loading()).toBe(false);
    expect(store.error()).toBe('update-failed');
    expect(onError).toHaveBeenCalled();
  });

  it('deleteOne success removes from list, resets current, and optionally refreshes', () => {
    const a1 = article({ slug: 'a1' });
    const a2 = article({ slug: 'a2' });
    (store as any).articles.set([a1, a2]);
    (store as any).total.set(2);
    (store as any).current.set(a2);
    api.deleteArticle.mockReturnValue(of(void 0));
    api.getArticles.mockReturnValue(of({ articles: [a1], articlesCount: 1 }));
    store.deleteOne('a2', true);
    expect(store.loading()).toBe(false);
    expect(store.error()).toBeNull();
    expect(store.current()).toBeNull();
    expect(store.articles().some(x => x.slug === 'a2')).toBe(false);
    expect(store.total()).toBe(1);
    expect(api.getArticles).toHaveBeenCalled();
  });

  it('deleteOne error sets error and leaves state consistent', () => {
    const a1 = article({ slug: 'a1' });
    (store as any).articles.set([a1]);
    (store as any).total.set(1);
    api.deleteArticle.mockReturnValue(throwError(() => new Error('del-failed')));
    store.deleteOne('a1', false);
    expect(store.loading()).toBe(false);
    expect(store.error()).toBe('del-failed');
    expect(store.articles().length).toBe(1);
    expect(store.total()).toBe(1);
  });
});
