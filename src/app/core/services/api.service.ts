import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private readonly baseUrl = 'https://api.realworld.io/api';

  get<T>(url: string, params?: Record<string, any>) {
    const httpParams = new HttpParams({ fromObject: params ?? {} });
    return this.http.get<T>(`${this.baseUrl}${url}`, { params: httpParams });
  }

  post<T>(url: string, body: unknown) {
    return this.http.post<T>(`${this.baseUrl}${url}`, body);
  }

  put<T>(url: string, body: unknown) {
    return this.http.put<T>(`${this.baseUrl}${url}`, body);
  }

  delete<T>(url: string) {
    return this.http.delete<T>(`${this.baseUrl}${url}`);
  }
}
