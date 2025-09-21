import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { PostDetailComponent } from './post-details';
import { ArticleDto } from '@shared/dtos/article.dto';

class StoreMock {
  loading = signal(false);
  currentSig = signal<ArticleDto | null>(null);
  current = this.currentSig as any;
  loadOne = vi.fn<(slug: string) => void>();
  deleteOne = vi.fn<(slug: string) => void>();
}

function makeArticle(p: Partial<ArticleDto> = {}): ArticleDto {
  return {
    slug: 's1',
    title: 'Post Title',
    description: 'Desc',
    body: 'Body text',
    tagList: ['a'],
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date().toISOString(),
    author: { username: 'john' },
    ...p,
  };
}

describe('PostDetailComponent', () => {
  let store: StoreMock;
  let router: { navigate: ReturnType<typeof vi.fn> };
  let dialog: { open: ReturnType<typeof vi.fn> };

  function setup(params: Record<string, string> = { slug: 's1' }) {
    store = new StoreMock();
    router = { navigate: vi.fn() };
    dialog = {
      open: vi.fn(() => ({ afterClosed: () => of(true) })),
    };

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [PostDetailComponent, NoopAnimationsModule],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { params } } },
        { provide: Router, useValue: router },
        { provide: MatDialog, useValue: dialog },
        {
          provide: (PostDetailComponent as any).ɵcmp.providers?.[0]?.useToken ?? class {},
          useValue: store,
        },
      ],
    });

    const fixture = TestBed.createComponent(PostDetailComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    return { fixture, component };
  }

  it('calls store.loadOne with slug from route', () => {
    setup({ slug: 'my-slug' });
    expect(store.loadOne).toHaveBeenCalledWith('my-slug');
  });

  it('renders title, meta and markdown body when current is set', () => {
    const { fixture } = setup();
    store.currentSig.set(makeArticle({ title: 'Hello', body: 'Body text' }));
    fixture.detectChanges();

    const title = (fixture.nativeElement as HTMLElement).querySelector('.title')!;
    expect(title.textContent).toContain('Hello');

    const meta = (fixture.nativeElement as HTMLElement).querySelector('.meta')!;
    expect(meta.textContent).toContain('john');

    const bodyEl = fixture.debugElement.query(By.css('.prose')).nativeElement as HTMLElement;
    expect(bodyEl.textContent).toContain('Body text');
  });

  it('shows loading panel when current is null', () => {
    const { fixture } = setup();
    store.currentSig.set(null);
    fixture.detectChanges();
    const panel = fixture.debugElement.query(By.css('.panel'));
    expect(panel).toBeTruthy();
  });

  it('when delete is confirmed, calls store.deleteOne and navigates back', async () => {
    const { fixture, component } = setup();
    store.currentSig.set(makeArticle({ slug: 's2' }));
    fixture.detectChanges();

    dialog.open = vi.fn(() => ({ afterClosed: () => of(true) }));
    await component.onDelete('s2');

    expect(store.deleteOne).toHaveBeenCalledWith('s2');
    expect(router.navigate).toHaveBeenCalledWith(['/posts']);
  });

  it('when delete is canceled, does not call store.deleteOne', async () => {
    const { component } = setup();
    dialog.open = vi.fn(() => ({ afterClosed: () => of(false) }));
    await component.onDelete('s1');
    expect(store.deleteOne).not.toHaveBeenCalled();
  });

  it('has edit and delete actions when post is present', () => {
    const { fixture } = setup();
    store.currentSig.set(makeArticle({ slug: 's3' }));
    fixture.detectChanges();

    const editBtn = fixture.debugElement.query(By.css('a[mat-stroked-button][color="primary"]'));
    const delBtn = fixture.debugElement.query(By.css('button[mat-stroked-button][color="warn"]'));
    expect(editBtn).toBeTruthy();
    expect(delBtn).toBeTruthy();
  });
});
