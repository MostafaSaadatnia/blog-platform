import { Component, inject, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OnlineOfflineToastComponent } from './shared/components/online-offline-toast/online-offline-toast';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ThemeService } from '@core/services/theme.service';
import { MatDividerModule } from '@angular/material/divider';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule,
    OnlineOfflineToastComponent,
  ],
  template: `
    <mat-toolbar color="primary" class="app-toolbar">
      <button mat-button routerLink="/">Blog Platform</button>
      <span style="flex:1"></span>
      <a mat-button routerLink="/posts">Posts</a>
      <a mat-stroked-button color="accent" routerLink="/editor"> <mat-icon>add</mat-icon> New </a>

      <button mat-icon-button [matMenuTriggerFor]="brandMenu" aria-label="Theme">
        <mat-icon>palette</mat-icon>
      </button>
      <mat-menu #brandMenu="matMenu">
        <button mat-menu-item (click)="toggleDark()">
          <mat-icon>{{ !theme.isDark() ? 'dark_mode' : 'light_mode' }}</mat-icon>
          <span>Toggle {{ !theme.isDark() ? 'Dark' : 'Light' }}</span>
        </button>
      </mat-menu>
    </mat-toolbar>

    <main class="app-main">
      <div class="app-container">
        <router-outlet />
        <app-online-offline-toast />
      </div>
    </main>
  `,
  styles: [
    `
      .spacer {
        flex: 1 1 auto;
      }
    `,
  ],
})
export class App implements OnInit {
  protected theme = inject(ThemeService);
  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.theme.init();
    }
  }

  pick(id: 'aurora' | 'ink' | 'sunset') {
    this.theme.setBrand(id);
  }
  toggleDark() {
    this.theme.toggleDark();
  }
}
