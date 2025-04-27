import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Result } from '../models/result.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ResultService {
  private api = '/api/results';

  constructor(private http: HttpClient) {}

  save(result: Omit<Result, 'id'>): Observable<Result> {
    return this.http.post<Result>(this.api, result);
  }

  getByTest(testId: string): Observable<Result[]> {
    console.log('Ищу результаты по testId =', testId);
    return this.http.get<Result[]>(`${this.api}?testId=${encodeURIComponent(testId)}`);
  }


  getByUser(userId: string): Observable<Result[]> {
    return this.http.get<Result[]>(`${this.api}?userId=${encodeURIComponent(userId)}`);
  }
}
