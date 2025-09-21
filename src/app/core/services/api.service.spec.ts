import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let svc: ApiService;
  let http: HttpTestingController;
  const base = 'https://api.realworld.show/api';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService],
    });
    svc = TestBed.inject(ApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('get serializes params and prefixes baseUrl', () => {
    let res: any;
    svc
      .get('/articles', { a: 1, b: undefined, c: null, d: ['x', 'y'] })
      .subscribe((r) => (res = r));
    const req = http.expectOne((r) => r.method === 'GET' && r.url === `${base}/articles`);
    expect(req.request.params.get('a')).toBe('1');
    expect(req.request.params.has('b')).toBe(false);
    expect(req.request.params.has('c')).toBe(false);
    expect(req.request.params.get('d')).toBe('x,y');
    req.flush({ ok: true });
    expect(res.ok).toBe(true);
  });

  it('post sends body and params', () => {
    const body = { k: 'v' };
    let res: any;
    svc.post('/articles', body, { q: '1' }).subscribe((r) => (res = r));
    const req = http.expectOne((r) => r.method === 'POST' && r.url === `${base}/articles`);
    expect(req.request.body).toEqual(body);
    expect(req.request.params.get('q')).toBe('1');
    req.flush({ id: 10 });
    expect(res.id).toBe(10);
  });

  it('put sends body and params', () => {
    const body = { title: 't' };
    let res: any;
    svc.put('/articles/1', body, { draft: true }).subscribe((r) => (res = r));
    const req = http.expectOne((r) => r.method === 'PUT' && r.url === `${base}/articles/1`);
    expect(req.request.body).toEqual(body);
    expect(req.request.params.get('draft')).toBe('true');
    req.flush({ ok: 1 });
    expect(res.ok).toBe(1);
  });

  it('delete sends params only', () => {
    let completed = false;
    svc.delete('/articles/1', { hard: 0 }).subscribe({ complete: () => (completed = true) });
    const req = http.expectOne((r) => r.method === 'DELETE' && r.url === `${base}/articles/1`);
    expect(req.request.params.get('hard')).toBe('0');
    req.flush(null);
    expect(completed).toBe(true);
  });

  it('toParams handles empty/undefined/null gracefully via public methods', () => {
    let res: unknown;
    svc.get('/ping', undefined).subscribe((r) => (res = r));
    const r1 = http.expectOne(`${base}/ping`);
    expect(r1.request.params.keys().length).toBe(0);
    r1.flush({ ok: true });

    svc.get('/ping2', { a: null, b: undefined }).subscribe();
    const r2 = http.expectOne(`${base}/ping2`);
    expect(r2.request.params.keys().length).toBe(0);
    r2.flush({ ok: true });
  });
});
