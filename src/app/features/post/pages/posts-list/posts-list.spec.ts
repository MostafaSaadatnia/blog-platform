import { render, screen } from '@analogjs/vitest-angular';
import PostsListComponent from './posts-list';
import { PostsStore } from '@features/posts/posts.store';
import { signal } from '@angular/core';

describe('PostsListComponent', () => {
  it('shows articles and paginator', async () => {
    const storeMock = {
      loading: signal(false).asReadonly(),
      page: signal(1).asReadonly(),
      pageSize: signal(10).asReadonly(),
      total: signal(1).asReadonly(),
      articles: signal([{
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
      }]).asReadonly(),
      loadPage: vi.fn()
    } as unknown as InstanceType<typeof PostsStore>;

    await render(PostsListComponent, {
      providers: [{ provide: PostsStore, useValue: storeMock }]
    });

    expect(screen.getByText('Posts')).toBeInTheDocument();
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
