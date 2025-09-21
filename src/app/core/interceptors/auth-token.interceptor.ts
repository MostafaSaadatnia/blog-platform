import { HttpInterceptorFn } from '@angular/common/http';

// TODO: AFTER develop the backend This section be able to extend
export const AuthTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const mockToken = 'SAMPLE_MOCK_TOKEN';
  const token = localStorage.getItem('rw_token') || mockToken;
  if (!token) return next(req);
  return next(req.clone({ setHeaders: { Authorization: `Token ${token}` } }));
};
