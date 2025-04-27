import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { Observable, switchMap } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = '/api/users';
  private current: User | null = null;

  constructor(private http: HttpClient) {
    const stored = localStorage.getItem('currentUser');
    if (stored) this.current = JSON.parse(stored);
  }

  register(u: Omit<User, 'id'>): Observable<boolean> {
    return this.http.get<User[]>(`${this.api}?username=${encodeURIComponent(u.username)}`).pipe(
      map((users) => users.length > 0),
      tap((exists) => {
        if (exists) {
          throw new Error('Пользователь с таким именем уже существует');
        }
      }),
      // Если пользователя нет, делаем регистрацию
      map(() => u),
      // POST запрос для создания нового пользователя
      switchMap((user) => this.http.post<User>(this.api, user)),
      tap((newUser) => {
        this.current = newUser;
        localStorage.setItem('currentUser', JSON.stringify(newUser));
      }),
      map(() => true)
    );
  }

  login(username: string, password: string): Observable<boolean> {
    return this.http.get<User[]>(`${this.api}?username=${encodeURIComponent(username)}`).pipe(
      map((users) => users.find((u) => u.password === password) || null),
      tap((user) => {
        if (user) {
          this.current = user;
          localStorage.setItem('currentUser', JSON.stringify(user));
        }
      }),
      map((user) => !!user)
    );
  }

  logout() {
    this.current = null;
    localStorage.removeItem('currentUser');
  }

  getCurrent(): User | null {
    return this.current;
  }
}
