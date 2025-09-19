import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { PostsStore } from './posts.store';
import { ApiService } from '@core/services/api.service';
import { ArticlesResponse } from '@shared/models/article.model';

describe('PostsStore', () => {
  const mockArticles: ArticlesResponse = {
    articlesCount: 2,
    articles: [
      {
        slug: 'hello-world',
        title: 'Hello World',
        description: 'Desc',
        body: 'Body',
        tagList: ['hello', 'world'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        favorited: false,
        favoritesCount: 0,
        author: { username: 'mo', following: false, image: '' }
      },
      {
        slug: 'second',
        title: 'Second',
        description: 'Desc2',
        body: 'Body2',
        tagList: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        favorited: false,
        favoritesCount: 1,
        author: { username: 'sa', following: false, image: '' }
      }
    ]
  };

  it('should load first page and set state', () => {
    const apiMock = {
      get: vi.fn().mockReturnValue(of(mockArticles))
    } as unknown as ApiService;

    TestBed.configureTestingModule({
      providers: [{ provide: ApiService, useValue: apiMock }]
    });

    const store = TestBed.inject(PostsStore);
    store.loadPage(1, 10);

    expect(store.loading()).toBe(false);
    expect(store.articles().length).toBe(2);
    expect(store.total()).toBe(2);
    expect(apiMock.get).toHaveBeenCalledWith('/articles', { limit: 10, offset: 0 });
  });

  it('should handle error', () => {
    const apiMock = {
      get: vi.fn().mockReturnValue(throwError(() => new Error('boom')))
    } as unknown as ApiService;

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [{ provide: ApiService, useValue: apiMock }]
    });

    const store = TestBed.inject(PostsStore);
    store.loadPage(1, 10);

    expect(store.loading()).toBe(false);
    expect(store.error()).toContain('boom');
  });
});
