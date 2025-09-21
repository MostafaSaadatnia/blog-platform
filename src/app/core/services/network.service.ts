import { DestroyRef, Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class NetworkService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  private onlineSig = signal<boolean>(this.isBrowser ? navigator.onLine : true);

  online = this.onlineSig.asReadonly();

  constructor() {
    if (!this.isBrowser) return;

    const destroyRef = inject(DestroyRef);
    const update = () => this.onlineSig.set(navigator.onLine);

    window.addEventListener('online', update);
    window.addEventListener('offline', update);

    destroyRef.onDestroy(() => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    });
  }
}
