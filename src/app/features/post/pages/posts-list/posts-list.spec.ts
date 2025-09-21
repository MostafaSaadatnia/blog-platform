import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import PostsList from './posts-list';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { signal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ArticleDto } from '@shared/dtos/article.dto';

class StoreMock {
  page = signal(1);
  pageSize = signal(10);
  total = signal(0);
  loading = signal(false);
  error = signal<string | null>(null);
  articles = signal<ArticleDto[]>([]);
  loadPage = vi.fn<(page?: number, pageSize?: number) => void>();
}

describe('PostsList', () => {
  let store: StoreMock;
  let router: { navigate: ReturnType<typeof vi.fn> };
  let qpm$: BehaviorSubject<any>;

  function setup(qp: Record<string, any> = {}) {
    store = new StoreMock();
    router = { navigate: vi.fn() };
    qpm$ = new BehaviorSubject(convertToParamMap(qp));

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [PostsList, NoopAnimationsModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { queryParamMap: convertToParamMap(qp) },
            queryParamMap: qpm$.asObservable(),
          },
        },
        { provide: Router, useValue: router },
        { provide: (PostsList as any).ɵcmp.providers?.[0]?.useToken ?? class {}, useValue: store },
      ],
    });

    const fixture = TestBed.createComponent(PostsList);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    return { fixture, component };
  }

  it('calls loadPage with defaults when no query params', () => {
    setup({});
    expect(store.loadPage).toHaveBeenCalledWith(1, 10);
  });

  it('calls loadPage with page and pageSize from query params', () => {
    setup({ page: '3', pageSize: '5' });
    expect(store.loadPage).toHaveBeenCalledWith(3, 5);
  });

  it('shows spinner when loading is true', () => {
    const { fixture } = setup({});
    store.loading.set(true);
    fixture.detectChanges();
    const spinner = fixture.debugElement.query(By.css('mat-progress-spinner'));
    expect(spinner).toBeTruthy();
  });

  it('renders empty state when no articles', () => {
    const { fixture } = setup({});
    store.loading.set(false);
    store.articles.set([]);
    store.total.set(0);
    fixture.detectChanges();
    const empty = fixture.debugElement.query(By.css('.empty'));
    expect(empty).toBeTruthy();
    expect((empty.nativeElement as HTMLElement).textContent).toContain('No posts found');
  });

  it('renders cards when articles exist', () => {
    const { fixture } = setup({});
    store.loading.set(false);
    store.articles.set([
      { slug: 'a-1', title: 'A1', author: { username: 'u1' } } as any,
      { slug: 'a-2', title: 'A2', author: { username: 'u2' } } as any,
    ]);
    store.total.set(2);
    fixture.detectChanges();
    const cards = fixture.debugElement.queryAll(By.css('app-post-card'));
    expect(cards.length).toBe(2);
  });

  it('shows meta with page info when total > 0', () => {
    const { fixture } = setup({});
    store.total.set(42);
    store.page.set(2);
    store.pageSize.set(10);
    fixture.detectChanges();
    const meta = (fixture.nativeElement as HTMLElement).querySelector('.footer .meta')!;
    expect(meta.textContent).toContain('Page 2');
    expect(meta.textContent).toContain('42 total');
  });

  it('paginator emits and navigates with merged query params', () => {
    const { fixture } = setup({ foo: 'bar', page: '1', pageSize: '10' });
    const paginator = fixture.debugElement.query(By.css('mat-paginator'));
    paginator.triggerEventHandler('page', { pageIndex: 1, pageSize: 20 });
    expect(router.navigate).toHaveBeenCalledWith([], {
      queryParams: { page: 2, pageSize: 20 },
      queryParamsHandling: 'merge',
    });
  });

  it('reacts to queryParamMap changes after init and loads page', () => {
    setup({ page: '1', pageSize: '10' });
    qpm$.next(convertToParamMap({ page: '4', pageSize: '5' }));
    expect(store.loadPage).toHaveBeenLastCalledWith(4, 5);
  });

  it('maxPage computes from total and pageSize', () => {
    const { component } = setup({});
    store.total.set(23);
    store.pageSize.set(10);
    expect(component.maxPage).toBe(3);
  });
});
