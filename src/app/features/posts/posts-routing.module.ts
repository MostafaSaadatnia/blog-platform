import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import PostsList from './pages/posts-list/posts-list';


const routes: Routes = [{ path: '', component: PostsList }];


@NgModule({ imports: [RouterModule.forChild(routes)], exports: [RouterModule] })
export class PostsRoutingModule {}