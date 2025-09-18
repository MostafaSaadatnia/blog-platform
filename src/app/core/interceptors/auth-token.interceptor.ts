import { HttpInterceptorFn } from '@angular/common/http';

export const AuthTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('rw_token');
  return token
    ? next(req.clone({ setHeaders: { Authorization: `Token ${token}` } }))
    : next(req);
};