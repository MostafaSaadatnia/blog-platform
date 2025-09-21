import { inject } from '@angular/core';
import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { ArticleService } from '@features/post/services/article.service';
import { ArticleDto } from '@shared/dtos/article.dto';

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
        next: (res) =>
          patchState(store, {
            articles: res.articles,
            total: res.articlesCount,
            loading: false,
          }),
        error: (err: Error) =>
          patchState(store, { loading: false, error: err?.message ?? 'Load failed' }),
      });
    }

    function loadOne(slug: string) {
      patchState(store, { loading: true, error: null });
      api.getArticle(slug).subscribe({
        next: (a) => patchState(store, { current: a, loading: false }),
        error: (err: Error) =>
          patchState(store, { loading: false, error: err?.message ?? 'Load failed' }),
      });
    }

    function deleteOne(slug: string, refresh = true) {
      patchState(store, { loading: true, error: null });
      api.deleteArticle(slug).subscribe({
        next: () => {
          const list = store.articles().filter((x) => x.slug !== slug);
          patchState(store, {
            articles: list,
            total: Math.max(0, store.total() - 1),
            current: null,
            loading: false,
          });
          if (refresh) loadPage(store.page(), store.pageSize());
        },
        error: (err: Error) =>
          patchState(store, { loading: false, error: err?.message ?? 'Delete failed' }),
      });
    }

    function createOne(
      payload: Partial<ArticleDto>,
      onDone?: (slug: string) => void,
      onError?: (err: unknown) => void,
    ) {
      patchState(store, { loading: true, error: null });
      api.createArticle(payload).subscribe({
        next: (a) => {
          patchState(store, { current: a, loading: false });
          onDone?.(a.slug);
          loadPage(1, store.pageSize());
        },
        error: (err) => {
          patchState(store, { loading: false, error: (err as Error)?.message ?? 'Create failed' });
          onError?.(err);
        },
      });
    }

    function updateOne(
      slug: string,
      patch: Partial<ArticleDto>,
      onDone?: (slug: string) => void,
      onError?: (err: unknown) => void,
    ) {
      patchState(store, { loading: true, error: null });
      api.updateArticle(slug, patch).subscribe({
        next: (a) => {
          const updated = store.articles().map((x) => (x.slug === slug ? a : x));
          patchState(store, { articles: updated, current: a, loading: false });
          onDone?.(a.slug);
        },
        error: (err) => {
          patchState(store, { loading: false, error: (err as Error)?.message ?? 'Update failed' });
          onError?.(err);
        },
      });
    }

    function toggleFavorite(slug: string) {
      const list = store.articles();
      const current = store.current();
      const findInList = list.find((a) => a.slug === slug);
      const base = findInList ?? (current?.slug === slug ? current : null);
      if (!base) return;

      const optimistic: ArticleDto = {
        ...base,
        favorited: !base.favorited,
        favoritesCount: Math.max(0, (base.favoritesCount ?? 0) + (base.favorited ? -1 : 1)),
      };

      if (findInList) {
        patchState(store, { articles: list.map((a) => (a.slug === slug ? optimistic : a)) });
      }
      if (current?.slug === slug) {
        patchState(store, { current: optimistic });
      }

      const req$ = optimistic.favorited ? api.favorite(slug) : api.unfavorite(slug);
      req$.subscribe({
        next: (server) => {
          const synced = (a: ArticleDto) => (a.slug === slug ? server : a);
          if (findInList) patchState(store, { articles: store.articles().map(synced) });
          if (current?.slug === slug) patchState(store, { current: server });
        },
        error: () => {
          // rollback
          const rollback: ArticleDto = {
            ...optimistic,
            favorited: base.favorited,
            favoritesCount: base.favoritesCount,
          };
          if (findInList)
            patchState(store, {
              articles: store.articles().map((a) => (a.slug === slug ? rollback : a)),
            });
          if (current?.slug === slug) patchState(store, { current: rollback });
        },
      });
    }

    return { loadPage, loadOne, deleteOne, createOne, updateOne, toggleFavorite };
  }),
);
