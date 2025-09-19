import { render, screen } from '@analogjs/vitest-angular';
import { PostCardComponent } from './post-card';
import { ArticleDto } from '@shared/models/article.model';

describe('PostCardComponent', () => {
  const article: ArticleDto = {
    slug: 'hello-world',
    title: 'Hello World',
    description: 'Desc',
    body: 'Body',
    tagList: ['hello', 'world'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    favorited: false,
    favoritesCount: 3,
    author: { username: 'mo', following: false, image: '' }
  };

  it('renders title and tags', async () => {
    await render(PostCardComponent, {
      componentInputs: { article }
    });

    expect(screen.getByText('Hello World')).toBeInTheDocument();
    expect(screen.getByText('hello')).toBeInTheDocument();
    expect(screen.getByText('world')).toBeInTheDocument();
  });
});
