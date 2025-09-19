import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private readonly baseUrl = 'https://api.realworld.show/api';

  private toParams(params?: Record<string, any>): Record<string, string> {
    const out: Record<string, string> = {};
    if (!params) return out;
    for (const [k, v] of Object.entries(params)) {
      if (v === undefined || v === null) continue;
      out[k] = Array.isArray(v) ? v.join(',') : String(v);
    }
    return out;
  }

  get<T>(url: string, params?: Record<string, unknown>) {
    return this.http.get<T>(`${this.baseUrl}${url}`, { params: this.toParams(params) });
  }

  post<T>(url: string, body: unknown, params?: Record<string, unknown>) {
    return this.http.post<T>(`${this.baseUrl}${url}`, body, { params: this.toParams(params) });
  }

  put<T>(url: string, body: unknown, params?: Record<string, unknown>) {
    return this.http.put<T>(`${this.baseUrl}${url}`, body, { params: this.toParams(params) });
  }

  delete<T>(url: string, params?: Record<string, unknown>) {
    return this.http.delete<T>(`${this.baseUrl}${url}`, { params: this.toParams(params) });
  }
}