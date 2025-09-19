import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { NetworkService } from './network.service';

describe('NetworkService (SSR safe)', () => {
  it('should not touch window on server', () => {
    TestBed.configureTestingModule({
      providers: [
        { provide: PLATFORM_ID, useValue: 'server' },
        NetworkService
      ]
    });
    const svc = TestBed.inject(NetworkService);
    expect(svc.online()).toBe(true);
  });
});