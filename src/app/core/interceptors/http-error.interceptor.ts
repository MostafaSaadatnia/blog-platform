import { HttpInterceptorFn } from '@angular/common/http';

export const HttpErrorInterceptor: HttpInterceptorFn = (req, next) =>
  next(req);