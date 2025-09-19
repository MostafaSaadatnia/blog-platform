import { render, screen } from '@analogjs/vitest-angular';
import { PostCardComponent } from './post-card';
import { ArticleDto } from '@shared/models/article.model';

describe('PostCardComponent', () => {
  const article: ArticleDto = {
    slug: 'hello-world',
    title: 'Hello World',
    description: 'Desc',
    body: 'Body',
    tagList: ['a', 'b'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    favorited: false,
    favoritesCount: 2,
    author: { username: 'mo', following: false, image: '' },
  };

  it('renders title and tags', async () => {
    await render(PostCardComponent, { componentInputs: { article } });
    expect(screen.getByText('Hello World')).toBeInTheDocument();
    expect(screen.getByText('a')).toBeInTheDocument();
    expect(screen.getByText('b')).toBeInTheDocument();
  });
});
