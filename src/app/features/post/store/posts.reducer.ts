import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { ArticleDto } from '../../../shared/models/article.model';
import { PostsActions } from './post.action';



export interface PostsState extends EntityState<ArticleDto> {
loading: boolean;
page: number;
pageSize: number;
total: number;
}


const adapter = createEntityAdapter<ArticleDto>({ selectId: a => a.slug });


const initialState: PostsState = adapter.getInitialState({
loading: false,
page: 1,
pageSize: 10,
total: 0,
});


export const postsReducer = createReducer(
initialState,
on(PostsActions.loadPage, (state, { page, pageSize }) => ({ ...state, loading: true, page, pageSize })),
on(PostsActions.loadPageSuccess, (state, { articles, total }) =>
adapter.setAll(articles, { ...state, loading: false, total })
),
on(PostsActions.loadPageFailure, (state) => ({ ...state, loading: false }))
);


export const { selectAll: selectAllArticles, selectEntities: selectArticleEntities } = adapter.getSelectors();