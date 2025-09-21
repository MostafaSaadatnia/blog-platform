import { inject } from '@angular/core';
import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { CommentsService } from '@features/post/services/comments.service';
import { CommentDto } from '@shared/dtos/comment.dto';

interface CommentsState {
  loading: boolean;
  posting: boolean;
  deletingId: number | null;
  error: string | null;
  items: CommentDto[];
  slug: string | null;
}

export const CommentsStore = signalStore(
  { providedIn: 'root' },
  withState<CommentsState>({
    loading: false,
    posting: false,
    deletingId: null,
    error: null,
    items: [],
    slug: null,
  }),
  withMethods((store, api: CommentsService = inject(CommentsService)) => {
    function load(slug: string) {
      patchState(store, { loading: true, error: null, slug });
      api.list(slug).subscribe({
        next: (items) => patchState(store, { items, loading: false }),
        error: (err: Error) =>
          patchState(store, { loading: false, error: err?.message ?? 'Failed to load comments' }),
      });
    }

    function add(body: string) {
      const slug = store.slug();
      if (!slug) return;
      patchState(store, { posting: true, error: null });
      api.add(slug, body).subscribe({
        next: (c) => patchState(store, { items: [c, ...store.items()], posting: false }),
        error: (err: Error) =>
          patchState(store, { posting: false, error: err?.message ?? 'Failed to post comment' }),
      });
    }

    function remove(id: number) {
      const slug = store.slug();
      if (!slug) return;
      patchState(store, { deletingId: id, error: null });
      api.remove(slug, id).subscribe({
        next: () =>
          patchState(store, {
            items: store.items().filter((c) => c.id !== id),
            deletingId: null,
          }),
        error: (err: Error) =>
          patchState(store, {
            deletingId: null,
            error: err?.message ?? 'Failed to delete comment',
          }),
      });
    }

    return { load, add, remove };
  }),
);
