import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NetworkService } from '@core/services/network.service';

@Component({
  selector: 'app-online-offline-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (visible()) {
      <div
        class="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 rounded-xl px-4 py-2 text-sm shadow
      text-white"
        [class.bg-red-600]="!net.online()"
        [class.bg-green-600]="net.online()"
      >
        {{
          net.online()
            ? 'Back online. Content will refresh.'
            : 'You are offline. Showing cached content.'
        }}
      </div>
    }
  `,
})
export class OnlineOfflineToastComponent {
  net = inject(NetworkService);
  visible = signal(false);

  constructor() {
    effect(() => {
      this.net.online();
      this.visible.set(true);
      setTimeout(() => this.visible.set(false), 2000);
    });
  }
}
