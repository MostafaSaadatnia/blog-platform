import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { AuthTokenInterceptor } from './auth-token.interceptor';

describe('AuthTokenInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.setItem('rw_token', 'XYZ');
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([AuthTokenInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    localStorage.removeItem('rw_token');
    httpMock.verify();
  });

  it('should attach Authorization header when token exists', () => {
    http.get('/ping').subscribe();
    const req = httpMock.expectOne('/ping');
    expect(req.request.headers.get('Authorization')).toBe('Token XYZ');
    req.flush({});
  });
});
