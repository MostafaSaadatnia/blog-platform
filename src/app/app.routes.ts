import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'posts' },

  {
    path: 'posts',
    loadComponent: () =>
      import('@features/post/pages/posts-list/posts-list').then((m) => m.default),
    data: { preload: false },
  },

  {
    path: 'posts/:slug',
    loadComponent: () =>
      import('@features/post/pages/post-details/post-details').then((m) => m.PostDetailComponent),
    data: { preload: false },
  },

  {
    path: 'editor',
    loadComponent: () =>
      import('@features/post/pages/editor/editor').then((m) => m.PostEditorComponent),
    data: { preload: false },
  },

  {
    path: 'editor/:slug',
    loadComponent: () =>
      import('@features/post/pages/editor/editor').then((m) => m.PostEditorComponent),
    data: { preload: false },
  },

  { path: '**', redirectTo: 'posts' },
];