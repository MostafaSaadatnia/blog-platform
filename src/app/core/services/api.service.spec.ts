import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let api: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ApiService,
        provideHttpClient(withFetch()),
        provideHttpClientTesting()
      ]
    });
    api = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('GET /articles with limit/offset', () => {
    api.get<>('/articles', { limit: 10, offset: 0 }).subscribe((res) => {
      expect(res.ok).toBe(true);
    });

    const req = httpMock.expectOne('https://api.realworld.show/api/articles?limit=10&offset=0');
    expect(req.request.method).toBe('GET');
    req.flush({ ok: true });
  });
});
