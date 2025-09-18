import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ApiService } from '@/core/services/api.service';

import { PostsActions } from './post.action';
import { map, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';


export const loadPageEffect = createEffect(() => {
    const actions$ = inject(Actions);
    const api = inject(ApiService);


    return actions$.pipe(
        ofType(PostsActions.loadPage),
        switchMap(({ page, pageSize }) => {
            const offset = (page - 1) * pageSize;
            return api.get<{ articles: any[]; articlesCount: number }>(`/articles`, { limit: pageSize, offset }).pipe(
                map((res) => PostsActions.loadPageSuccess({ articles: res.articles, total: res.articlesCount })),
                catchError((error) => of(PostsActions.loadPageFailure({ error })))
            );
        })
    );
});