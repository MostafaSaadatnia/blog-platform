import { ArticleDto } from '@/shared/models/article.model';
import { createActionGroup, props } from '@ngrx/store';



export const PostsActions = createActionGroup({
    source: 'Posts',
    events: {
        'Load Page': props<{ page: number; pageSize: number }>(),
        'Load Page Success': props<{ articles: ArticleDto[]; total: number }>(),
        'Load Page Failure': props<{ error: any }>(),
    },
});