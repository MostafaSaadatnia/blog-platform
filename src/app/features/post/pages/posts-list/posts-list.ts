import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { PostCardComponent } from '@/features/post/components/post-card/post-card';
import { PostsStore } from '@features/post/store/posts.store';


@Component({
  selector: 'app-posts-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    PostCardComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    .header { display:flex; align-items:center; justify-content:space-between; gap:.75rem; margin-bottom:1rem; }
    .title { font-size:1.5rem; font-weight:600; letter-spacing:-.01em; margin:0; }
    .grid { display:grid; gap:1rem; grid-template-columns:repeat(1,minmax(0,1fr)); }
    @media (min-width:768px){ .grid{ grid-template-columns:repeat(2,minmax(0,1fr)); } }
    @media (min-width:1024px){ .grid{ grid-template-columns:repeat(3,minmax(0,1fr)); } }
    .center { display:flex; align-items:center; justify-content:center; }
    .empty { opacity:.7; padding:4rem 0; text-align:center; display:grid; gap:.5rem; place-items:center; }
    .footer { margin-top:1rem; display:flex; align-items:center; justify-content:space-between; gap:.75rem; flex-wrap:wrap; }
  `],
  template: `
    <section class="container">
      <header class="header">
        <h1 class="title">Posts</h1>
        <a mat-flat-button color="primary" routerLink="/editor" aria-label="Create new post">
          <mat-icon>add</mat-icon>
          New Post
        </a>
      </header>

      @if (store.loading()) {
        <div class="center" style="padding: 4rem 0;">
          <mat-progress-spinner mode="indeterminate" diameter="32"></mat-progress-spinner>
        </div>
      } @else {
        @if (articles().length) {
          <div class="grid">
            @for (a of articles(); track a.slug) {
              <app-post-card [article]="a"></app-post-card>
            }
          </div>
        } @else {
          <div class="empty">
            <mat-icon fontIcon="inbox" style="font-size: 40px;"></mat-icon>
            <p>No posts found</p>
            <a mat-stroked-button color="primary" routerLink="/editor">Create your first post</a>
          </div>
        }
      }

      <footer class="footer">
        <div class="meta">
          @if (store.total() > 0) {
            <span>Page {{ store.page() }} / {{ maxPage }} — {{ store.total() }} total</span>
          }
        </div>

        <mat-paginator
          [length]="store.total()"
          [pageIndex]="store.page() - 1"
          [pageSize]="store.pageSize()"
          [pageSizeOptions]="[5, 10, 20]"
          [showFirstLastButtons]="true"
          (page)="onPage($event)"
          aria-label="Posts pagination"
        ></mat-paginator>
      </footer>
    </section>
  `
})
export default class PostsList {
  readonly store = inject(PostsStore) as InstanceType<typeof PostsStore>;
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly qpm = toSignal(this.route.queryParamMap, { initialValue: this.route.snapshot.queryParamMap });

  // Signal from store (no select)
  readonly articles = this.store.articles;

  constructor() {
    effect(() => {
      const qp = this.qpm();
      const pageRaw = Number(qp.get('page') ?? 1);
      const sizeRaw = Number(qp.get('pageSize'));
      const page = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1;
      const pageSize = [5, 10, 20].includes(sizeRaw) ? sizeRaw : 10;
      this.store.loadPage(page, pageSize);
    });
  }

  get maxPage(): number {
    const total = this.store.total() || 0;
    const ps = this.store.pageSize() || 10;
    return Math.max(1, Math.ceil(total / ps));
  }

  onPage(e: PageEvent) {
    this.router.navigate([], {
      queryParams: { page: e.pageIndex + 1, pageSize: e.pageSize },
      queryParamsHandling: 'merge',
    });
  }
}
