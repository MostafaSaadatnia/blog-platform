import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';


import { PostCard } from '@/features/posts/components/post-card/post-card';
import { PostsStore } from '@/features/posts/store/posts.store';

@Component({
  selector: 'app-posts-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatPaginatorModule, MatProgressSpinnerModule, PostCard],
  template: `
 <section class="container mx-auto p-4">
      <h1 class="text-3xl font-bold mb-4">Posts</h1>

      @if(store.loading()){<div class="min-h-10">
        <mat-progress-spinner mode="indeterminate"></mat-progress-spinner>
      </div>
      }

      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        @for (a of store.articles(); track a.slug) {
          <app-post-card [article]="a" />
        }
      </div>

      <div class="mt-4">
        <mat-paginator
          [length]="store.total()"
          [pageSize]="store.pageSize()"
          [pageIndex]="store.page() - 1"
          [pageSizeOptions]="[5,10,20]"
          (page)="onPage($event)">
        </mat-paginator>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export default class PostsList implements OnInit {
  store = inject(PostsStore) as InstanceType<typeof PostsStore>;

  ngOnInit(): void {
    this.store.loadPage(1, this.store.pageSize());
  }

  onPage(e: PageEvent) {
    this.store.loadPage(e.pageIndex + 1, e.pageSize);
  }
}