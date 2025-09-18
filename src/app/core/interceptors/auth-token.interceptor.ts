import { HttpInterceptorFn } from '@angular/common/http';


export const AuthTokenInterceptor: HttpInterceptorFn = (req, next) => {
const token = localStorage.getItem('rw_token');
if (!token) return next(req);
return next(req.clone({ setHeaders: { Authorization: `Token ${token}` } }));
};