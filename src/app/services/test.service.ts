import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Test } from '../models/test.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TestService {
  private api = '/api/tests';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Test[]> {
    return this.http.get<Test[]>(this.api);
  }

  getById(id: string): Observable<Test> {
    return this.http.get<Test>(`${this.api}/${id}`);
  }

  create(test: Omit<Test, 'id'>): Observable<Test> {
    return this.http.post<Test>(this.api, test);
  }
}
