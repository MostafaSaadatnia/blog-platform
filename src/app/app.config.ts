import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideServiceWorker } from '@angular/service-worker';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
// TODO: USE IT WHEN THE REAL SERVER BE READY...
// import { AuthTokenInterceptor } from '@core/interceptors/auth-token.interceptor';
// import { HttpErrorInterceptor } from '@core/interceptors/http-error.interceptor';


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerImmediately',
    }),
    provideHttpClient(
      withFetch(),
      withInterceptors([
        // TODO: USE IT WHEN THE REAL SERVER BE READY...
        // AuthTokenInterceptor,
        // HttpErrorInterceptor,
      ]),
    ), provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
};