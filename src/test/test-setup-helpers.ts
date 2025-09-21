import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

export function initTestBed(providers: unknown[] = []) {
  TestBed.configureTestingModule({
    providers: [provideRouter([]), provideHttpClient(), ...providers],
  });
}
