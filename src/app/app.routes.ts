// import { Routes } from '@angular/router';

// export const routes: Routes = [
//   { path: '', pathMatch: 'full', redirectTo: 'posts' },
//   {
//     path: 'posts',
//     loadComponent: () =>
//       import('@/features/posts/pages/posts-list/posts-list').then((m) => m.default),
//   },

//   { path: '**', redirectTo: 'posts' },
// ];

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'posts' },
  { path: 'posts', loadChildren: () => import('@features/posts/posts.module').then(m => m.PostsModule) },
  { path: 'post', loadChildren: () => import('@features/post/post.module').then(m => m.PostModule) },
  { path: 'manage', loadChildren: () => import('@features/management/management.module').then(m => m.ManagementModule) },
  { path: '**', redirectTo: 'posts' },
];


@NgModule({ imports: [RouterModule.forRoot(routes, { bindToComponentInputs: true })], exports: [RouterModule] })
export class AppRoutingModule { }