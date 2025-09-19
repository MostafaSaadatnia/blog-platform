import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

export type ThemeId = 'aurora' | 'ink' | 'sunset';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private isBrowser = false;
  private current: ThemeId = 'aurora';
  private dark = false;

  constructor(
    @Inject(PLATFORM_ID) platformId: object,
    @Inject(DOCUMENT) private doc: Document
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      // read persisted state only in browser
      const saved = (localStorage.getItem('app.theme') as ThemeId) || 'aurora';
      const dark = localStorage.getItem('app.dark') === '1';
      this.current = saved;
      this.dark = dark;
    }
  }

  init(): void {
    if (!this.isBrowser) return;
    this.applyBrand(this.current);
    this.applyDark(this.dark);
  }

  setBrand(id: ThemeId): void {
    this.current = id;
    if (!this.isBrowser) return;
    localStorage.setItem('app.theme', id);
    this.applyBrand(id);
  }

  toggleDark(): void {
    this.dark = !this.dark;
    if (!this.isBrowser) return;
    localStorage.setItem('app.dark', this.dark ? '1' : '0');
    this.applyDark(this.dark);
  }

  public isDark(): boolean {
    return this.dark;
  }

  private applyBrand(id: ThemeId): void {
    if (!this.isBrowser) return;
    const root = this.doc.documentElement;
    root.classList.remove('theme-ink', 'theme-sunset');
    if (id === 'ink') root.classList.add('theme-ink');
    if (id === 'sunset') root.classList.add('theme-sunset');
  }

  private applyDark(enabled: boolean): void {
    if (!this.isBrowser) return;
    const root = this.doc.documentElement;
    root.classList.toggle('dark-theme', enabled);
  }
}
