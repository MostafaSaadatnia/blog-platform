import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OnlineOfflineToastComponent } from './shared/components/online-offline-toast/online-offline-toast';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, OnlineOfflineToastComponent],
  template: `
    <router-outlet />
    <app-online-offline-toast />
  `,
})
export class App {}