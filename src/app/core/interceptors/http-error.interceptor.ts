import { HttpInterceptorFn } from '@angular/common/http';

// TODO: AFTER develop the backend This section be able to extend
export const HttpErrorInterceptor: HttpInterceptorFn = (req, next) => next(req).pipe();
