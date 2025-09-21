import { TestBed } from '@angular/core/testing';
import { Component, inject, PLATFORM_ID, DestroyRef, signal } from '@angular/core';
import { NetworkService } from './network.service';

function setNavigatorOnline(value: boolean) {
  Object.defineProperty(window.navigator, 'onLine', { value, configurable: true });
}

@Component({
  standalone: true,
  template: ``,
})
class HostComponent {
  svc = inject(NetworkService);
}

describe('NetworkService (browser platform)', () => {
  let addSpy: ReturnType<typeof vi.spyOn>;
  let removeSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    addSpy = vi.spyOn(window, 'addEventListener');
    removeSpy = vi.spyOn(window, 'removeEventListener');
    setNavigatorOnline(true);

    TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [{ provide: PLATFORM_ID, useValue: 'browser' }],
    });
  });

  afterEach(() => {
    addSpy.mockRestore();
    removeSpy.mockRestore();
  });

  it('initializes with navigator.onLine and subscribes to online/offline events', () => {
    const fixture = TestBed.createComponent(HostComponent);
    const svc = fixture.componentInstance.svc;
    fixture.detectChanges();

    expect(svc.online()).toBe(true);
    expect(addSpy).toHaveBeenCalledWith('online', expect.any(Function));
    expect(addSpy).toHaveBeenCalledWith('offline', expect.any(Function));
  });

  it('updates signal on offline → online transitions', async () => {
    const fixture = TestBed.createComponent(HostComponent);
    const svc = fixture.componentInstance.svc;
    fixture.detectChanges();

    setNavigatorOnline(false);
    window.dispatchEvent(new Event('offline'));
    expect(svc.online()).toBe(false);

    setNavigatorOnline(true);
    window.dispatchEvent(new Event('online'));
    expect(svc.online()).toBe(true);
  });

  it('removes listeners on destroy', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    expect(removeSpy).not.toHaveBeenCalled();
    fixture.destroy();
    expect(removeSpy).toHaveBeenCalledWith('online', expect.any(Function));
    expect(removeSpy).toHaveBeenCalledWith('offline', expect.any(Function));
  });
});

describe('NetworkService (server platform)', () => {
  let addSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    addSpy = vi.spyOn(window, 'addEventListener');
    TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [{ provide: PLATFORM_ID, useValue: 'server' }],
    });
  });

  afterEach(() => addSpy.mockRestore());

  it('defaults to online=true and does not attach listeners on server', () => {
    const fixture = TestBed.createComponent(HostComponent);
    const svc = fixture.componentInstance.svc;
    fixture.detectChanges();

    expect(svc.online()).toBe(true);
    expect(addSpy).not.toHaveBeenCalled();
  });
});
