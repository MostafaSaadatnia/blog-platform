import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OnlineOfflineToastComponent } from './shared/components/online-offline-toast/online-offline-toast';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, MatToolbarModule, MatButtonModule, MatIconModule, OnlineOfflineToastComponent],
  template: `
    <mat-toolbar color="primary" class="app-toolbar">
      <button mat-button routerLink="/">Blog Platform</button>
      <span class="spacer"></span>
      <a mat-button routerLink="/posts">Posts</a>
      <a mat-stroked-button color="accent" routerLink="/editor">
        <mat-icon>add</mat-icon> New
      </a>
      <button mat-icon-button (click)="toggleTheme()" aria-label="Toggle theme">
        <mat-icon>dark_mode</mat-icon>
      </button>
    </mat-toolbar>

    <main class="app-main">
      <div class="app-container">
        <router-outlet></router-outlet>
      </div>
    </main>
    <app-online-offline-toast />
  `,
  styles: [`
    .spacer { flex: 1 1 auto; }
  `]
})
export class App {
  toggleTheme() {
    document.documentElement.classList.toggle('dark-theme');
  }
}