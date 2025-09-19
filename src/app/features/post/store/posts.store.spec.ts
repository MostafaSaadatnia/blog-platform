import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { PostsStore } from './posts.store';
import { ApiService } from '@core/services/api.service';
import { ArticlesResponse } from '@shared/models/article.model';

describe('PostsStore', () => {
  const mockArticles: ArticlesResponse = {
    articlesCount: 1,
    articles: [{
      slug: 'hello',
      title: 'Hello',
      description: 'Desc',
      body: 'Body',
      tagList: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      favorited: false,
      favoritesCount: 0,
      author: { username: 'mo', following: false, image: '' }
    }]
  };

  it('loads page and sets state', () => {
    const apiMock = { get: vi.fn().mockReturnValue(of(mockArticles)) } as unknown as ApiService;

    TestBed.configureTestingModule({
      providers: [{ provide: ApiService, useValue: apiMock }]
    });

    const store = TestBed.inject(PostsStore);
    store.loadPage(1, 10);
    expect(store.loading()).toBe(false);
    expect(store.articles().length).toBe(1);
    expect(store.total()).toBe(1);
  });

  it('handles error but not when offline', () => {
    const apiMock = { get: vi.fn().mockReturnValue(throwError(() => new Error('boom'))) } as unknown as ApiService;
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [{ provide: ApiService, useValue: apiMock }]
    });
    const store = TestBed.inject(PostsStore);

    const online = Object.getOwnPropertyDescriptor(window.navigator.__proto__, 'onLine');
    Object.defineProperty(window.navigator, 'onLine', { get: () => false, configurable: true });

    store.loadPage(1, 10);
    expect(store.loading()).toBe(false);
    expect(store.error()).toBeNull();

    if (online) Object.defineProperty(window.navigator, 'onLine', online!);
  });
});