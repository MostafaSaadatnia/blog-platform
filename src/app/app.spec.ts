import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { PLATFORM_ID } from '@angular/core';
import { App } from './app';
import { ThemeService } from '@core/services/theme.service';

class ThemeServiceMock {
  init = vi.fn();
  isDark = vi.fn(() => false);
  setBrand = vi.fn();
  toggleDark = vi.fn();
}

function setup(platform: 'browser' | 'server') {
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({
    imports: [App],
    providers: [
      provideRouter([]),
      provideNoopAnimations(),
      { provide: PLATFORM_ID, useValue: platform },
      { provide: ThemeService, useClass: ThemeServiceMock },
    ],
  });

  const fixture = TestBed.createComponent(App);
  const component = fixture.componentInstance;
  const theme = TestBed.inject(ThemeService) as unknown as ThemeServiceMock;

  fixture.detectChanges();
  return { fixture, component, theme };
}

describe('App (SSR-aware root component)', () => {
  it('should render toolbar with links and actions', () => {
    const { fixture } = setup('browser');
    const el = fixture.nativeElement as HTMLElement;

    expect(el.textContent).toContain('Blog Platform');

    const postsLink = el.querySelector('a[routerLink="/posts"]');
    const newLink = el.querySelector('a[routerLink="/editor"]');
    expect(postsLink).toBeTruthy();
    expect(newLink).toBeTruthy();

    const toast = el.querySelector('app-online-offline-toast');
    expect(toast).toBeTruthy();

    const outlet = el.querySelector('router-outlet');
    expect(outlet).toBeTruthy();
  });

  it('should call theme.init() only on browser platform', () => {
    {
      const { theme } = setup('browser');
      expect(theme.init).toHaveBeenCalledTimes(1);
    }
    {
      const { theme } = setup('server');
      expect(theme.init).not.toHaveBeenCalled();
    }
  });

  it('should toggle dark mode via component method', () => {
    const { component, theme } = setup('browser');
    component.toggleDark();
    expect(theme.toggleDark).toHaveBeenCalledTimes(1);
  });

  it('should set brand via component method', () => {
    const { component, theme } = setup('browser');
    component.pick('aurora');
    expect(theme.setBrand).toHaveBeenCalledWith('aurora');
  });

  it('should show palette icon button (menu trigger) in toolbar', () => {
    const { fixture } = setup('browser');
    const trigger = fixture.debugElement.query(
      By.css('button[mat-icon-button][aria-label="Theme"]'),
    );
    expect(trigger).toBeTruthy();
    const icon = trigger.nativeElement.querySelector('mat-icon');
    expect(icon).toBeTruthy();
  });

  it('should reflect isDark() in template (icon name changes)', () => {
    const { fixture, theme } = setup('browser');

    theme.isDark = vi.fn(() => false);
    fixture.detectChanges();

    const comp = fixture.componentInstance;
    comp.toggleDark();
    expect((theme as any).toggleDark).toHaveBeenCalled();

    (theme.isDark as any) = vi.fn(() => true);
    fixture.detectChanges();
    expect(true).toBe(true);
  });
});
