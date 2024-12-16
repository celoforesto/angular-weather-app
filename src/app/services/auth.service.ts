import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = 'auth_token';
  private loggedIn$ = new BehaviorSubject<boolean>(this.isLoggedIn());

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string) {
    const apiUrl = `${environment.apiUrl}/api/auth/login`;
    return this.http.post<{ token: string }>(apiUrl, { username, password }).pipe(
      catchError((error) => {
        if (error.status === 401) {
          this.logout();
        }
        return this.handleError(error);
      })
    );
  }

  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    this.loggedIn$.next(true);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.loggedIn$.next(false);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  get token(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error occurred:', error.message);
    return throwError(() => new Error('Error during authentication.'));
  }
}