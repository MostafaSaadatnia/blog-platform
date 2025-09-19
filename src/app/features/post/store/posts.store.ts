import { inject } from '@angular/core';
import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { ArticleDto } from '@/shared/models/article.model';
import { ArticleService } from '@/features/post/services/article.service';

interface PostsState {
  page: number;
  pageSize: number;
  total: number;
  loading: boolean;
  error: string | null;
  articles: ArticleDto[];
  current: ArticleDto | null;
}

export const PostsStore = signalStore(
  { providedIn: 'root' },
  withState<PostsState>({
    page: 1,
    pageSize: 10,
    total: 0,
    loading: false,
    error: null,
    articles: [],
    current: null,
  }),
  withMethods((store, api = inject(ArticleService)) => {
    function loadPage(page = store.page(), pageSize = store.pageSize()) {
      patchState(store, { page, pageSize, loading: true, error: null });
      api.getArticles(page, pageSize).subscribe({
        next: (res) => patchState(store, {
          articles: res.articles, total: res.articlesCount, loading: false
        }),
        error: (err: Error) => patchState(store, { loading: false, error: err?.message ?? 'Load failed' }),
      });
    }

    function loadOne(slug: string) {
      patchState(store, { loading: true, error: null });
      api.getArticle(slug).subscribe({
        next: (a) => patchState(store, { current: a, loading: false }),
        error: (err: Error) => patchState(store, { loading: false, error: err?.message ?? 'Load failed' }),
      });
    }

    function deleteOne(slug: string, refresh = true) {
      patchState(store, { loading: true, error: null });
      api.deleteArticle(slug).subscribe({
        next: () => {
          const list = store.articles().filter(x => x.slug !== slug);
          patchState(store, { articles: list, total: Math.max(0, store.total() - 1), current: null, loading: false });
          if (refresh) loadPage(store.page(), store.pageSize());
        },
        error: (err: Error) => patchState(store, { loading: false, error: err?.message ?? 'Delete failed' }),
      });
    }

    function createOne(
      payload: Partial<ArticleDto>,
      onDone?: (slug: string) => void,
      onError?: (err: unknown) => void
    ) {
      patchState(store, { loading: true, error: null });
      api.createArticle(payload).subscribe({
        next: (a) => {
          patchState(store, { current: a, loading: false });
          onDone?.(a.slug);
          loadPage(1, store.pageSize());
        },
        error: (err) => {
          patchState(store, { loading: false, error: (err as any)?.message ?? 'Create failed' });
          onError?.(err);
        }
      });
    }

    function updateOne(
      slug: string,
      patch: Partial<ArticleDto>,
      onDone?: (slug: string) => void,
      onError?: (err: unknown) => void
    ) {
      patchState(store, { loading: true, error: null });
      api.updateArticle(slug, patch).subscribe({
        next: (a) => {
          const updated = store.articles().map(x => x.slug === slug ? a : x);
          patchState(store, { articles: updated, current: a, loading: false });
          onDone?.(a.slug);
        },
        error: (err) => {
          patchState(store, { loading: false, error: (err as Error)?.message ?? 'Update failed' });
          onError?.(err);
        }
      });
    }

    return { loadPage, loadOne, deleteOne, createOne, updateOne };
  })
);
