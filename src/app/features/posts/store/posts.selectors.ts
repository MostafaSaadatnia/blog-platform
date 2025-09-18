import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PostsState, selectAllArticles } from './posts.reducer';


export const selectPostsState = createFeatureSelector<PostsState>('posts');
export const selectPostsLoading = createSelector(selectPostsState, s => s.loading);
export const selectPostsPage = createSelector(selectPostsState, s => s.page);
export const selectPostsPageSize = createSelector(selectPostsState, s => s.pageSize);
export const selectPostsTotal = createSelector(selectPostsState, s => s.total);
export const selectPostsList = createSelector(selectPostsState, selectAllArticles);