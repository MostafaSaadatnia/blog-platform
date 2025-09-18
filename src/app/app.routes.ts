import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'posts' },
  {
    path: 'posts',
    loadComponent: () =>
      import('@/features/posts/pages/posts-list/posts-list').then((m) => m.default),
  },

  { path: '**', redirectTo: 'posts' },
];