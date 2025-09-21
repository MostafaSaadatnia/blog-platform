import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { signal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PostEditorComponent } from './editor';
import { ArticleDto } from '@shared/dtos/article.dto';

class StoreMock {
  loadingSig = signal(false);
  currentSig = signal<ArticleDto | null>(null);

  loading = this.loadingSig;
  current = this.currentSig as any;

  loadOne = vi.fn<(slug: string) => void>();
  createOne =
    vi.fn<
      (
        payload: Partial<ArticleDto>,
        onDone?: (slug: string) => void,
        onError?: (err: unknown) => void,
      ) => void
    >();
  updateOne =
    vi.fn<
      (
        slug: string,
        patch: Partial<ArticleDto>,
        onDone?: (slug: string) => void,
        onError?: (err: unknown) => void,
      ) => void
    >();
}

function makeArticle(overrides: Partial<ArticleDto> = {}): ArticleDto {
  return {
    slug: 's1',
    title: 'T1',
    description: 'D1',
    body: 'B1',
    tagList: ['a', 'b'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    author: { username: 'u' },
    ...overrides,
  };
}

describe('PostEditorComponent', () => {
  let store: StoreMock;
  let router: { navigate: ReturnType<typeof vi.fn> };
  let snack: { open: ReturnType<typeof vi.fn> };

  function setup(params: Record<string, string> = {}) {
    store = new StoreMock();
    router = { navigate: vi.fn() };
    snack = { open: vi.fn() };

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [PostEditorComponent, NoopAnimationsModule],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { params } } },
        { provide: Router, useValue: router },
        { provide: MatSnackBar, useValue: snack },
        { provide: (PostEditorComponent as any).ɵcmp.providers[0].useToken, useValue: store }, // inject PostsStore mock
      ],
    });

    const fixture = TestBed.createComponent(PostEditorComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    return { fixture, component };
  }

  it('renders form fields and disables Save when invalid', () => {
    const { fixture } = setup({});
    const title = fixture.debugElement.query(By.css('input[formControlName="title"]'))
      .nativeElement as HTMLInputElement;
    const body = fixture.debugElement.query(By.css('textarea[formControlName="body"]'))
      .nativeElement as HTMLTextAreaElement;

    expect(title).toBeTruthy();
    expect(body).toBeTruthy();

    const saveBtn = fixture.debugElement.query(
      By.css('button[type="submit"], button[mat-flat-button]'),
    ).nativeElement as HTMLButtonElement;
    expect(saveBtn.disabled).toBe(true);
  });

  it('create mode: submits payload and calls store.createOne with callbacks', () => {
    const { fixture, component } = setup({});

    const title = fixture.debugElement.query(By.css('input[formControlName="title"]'))
      .nativeElement as HTMLInputElement;
    const desc = fixture.debugElement.query(By.css('input[formControlName="description"]'))
      .nativeElement as HTMLInputElement;
    const body = fixture.debugElement.query(By.css('textarea[formControlName="body"]'))
      .nativeElement as HTMLTextAreaElement;

    title.value = 'New Title';
    title.dispatchEvent(new Event('input'));
    desc.value = 'Desc';
    desc.dispatchEvent(new Event('input'));
    body.value = 'Body text';
    body.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    component.submit();

    expect(store.createOne).toHaveBeenCalledTimes(1);
    const [payload, onDone, onError] = store.createOne.mock.calls[0];

    expect(payload).toEqual({
      title: 'New Title',
      description: 'Desc',
      body: 'Body text',
      tagList: [],
    });

    (onDone as any)('new-slug');
    expect(snack.open).toHaveBeenCalledWith('Post created', 'OK', { duration: 2000 });
    expect(router.navigate).toHaveBeenCalledWith(['/posts', 'new-slug']);

    (onError as any)({ errors: { title: ['too short'] } });
    const titleCtrl = component.form.get('title')!;
    expect(titleCtrl.errors?.['server']).toContain('too short');
  });

  it('edit mode: loads article, patches form, and calls updateOne on submit', () => {
    const { fixture, component } = setup({ slug: 's1' });

    expect(store.loadOne).toHaveBeenCalledWith('s1');
    store.currentSig.set(
      makeArticle({ slug: 's1', title: 'Old', description: 'OldD', body: 'OldB' }),
    );
    fixture.detectChanges();

    const title = fixture.debugElement.query(By.css('input[formControlName="title"]'))
      .nativeElement as HTMLInputElement;
    const body = fixture.debugElement.query(By.css('textarea[formControlName="body"]'))
      .nativeElement as HTMLTextAreaElement;

    expect(title.value).toBe('Old');
    expect(body.value).toBe('OldB');

    title.value = 'Updated';
    title.dispatchEvent(new Event('input'));
    body.value = 'Updated body';
    body.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    component.submit();

    expect(store.updateOne).toHaveBeenCalledTimes(1);
    const [slug, patch, onDone] = store.updateOne.mock.calls[0];

    expect(slug).toBe('s1');
    expect(patch).toEqual({
      title: 'Updated',
      description: 'OldD',
      body: 'Updated body',
      tagList: ['a', 'b'],
    });

    (onDone as any)('s1');
    expect(snack.open).toHaveBeenCalledWith('Post updated', 'OK', { duration: 2000 });
    expect(router.navigate).toHaveBeenCalledWith(['/posts', 's1']);
  });

  it('shows progress bar when loading signal is true', () => {
    const { fixture } = setup({});
    store.loadingSig.set(true);
    fixture.detectChanges();
    const bar = fixture.debugElement.query(By.css('mat-progress-bar'));
    expect(bar).toBeTruthy();
  });

  it('blocks submit when form invalid and does not call store', () => {
    const { component } = setup({});
    component.form.setValue({ title: '', description: '', body: '' });
    component.submit();
    expect(store.createOne).not.toHaveBeenCalled();
    expect(store.updateOne).not.toHaveBeenCalled();
  });
});
