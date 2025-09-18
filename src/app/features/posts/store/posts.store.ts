import { inject } from '@angular/core';
import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { computed } from '@angular/core';
import { ApiService } from '@core/services/api.service';

import { ArticleDto, ArticlesResponse } from '@shared/models/article.model';

interface PostsState {
  page: number;
  pageSize: number;
  total: number;
  loading: boolean;
  error: string | null;
  articles: ArticleDto[];
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
  }),
  withMethods((store, api = inject(ApiService)) => {
    const offset = computed(() => (store.page() - 1) * store.pageSize());

    function loadPage(page = store.page(), pageSize = store.pageSize()) {
      patchState(store, { page, pageSize, loading: true, error: null });

      api
        .get<ArticlesResponse>('/articles', {
          limit: store.pageSize(),
          offset: offset(),
        })
        .subscribe({
          next: (res) => {
            patchState(store, {
              articles: res.articles,
              total: res.articlesCount,
              loading: false,
            });
          },
          error: (err) => {
            patchState(store, {
              loading: false,
              error: err?.message ?? 'Load failed',
            });
          },
        });
    }

    return {
      loadPage,
    };
  })
);
