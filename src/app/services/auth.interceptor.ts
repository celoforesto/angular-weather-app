import { HttpEvent, HttpRequest, HttpHandlerFn, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>, 
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const token = localStorage.getItem('auth_token');
  const isApiUrl = req.url.startsWith(environment.apiUrl);

  const cloned = token && isApiUrl
    ? req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`),
      })
    : req;

  return next(cloned).pipe(
    catchError((err) => {
      if (err.status === 401) {
        localStorage.removeItem('auth_token');
        inject(Router).navigate(['/login']);
      }
      throw err;
    })
  );
};