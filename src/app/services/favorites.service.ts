import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { CityWeatherDto } from '../models/city-weather.model';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private readonly apiUrl = `${environment.apiUrl}/api/favorites`;

  constructor(private http: HttpClient) {}

  getFavoritesWithWeather(): Observable<CityWeatherDto[]> {
    return this.http.get<CityWeatherDto[]>(`${this.apiUrl}/weather`);
  }

  addToFavorites(cityName: string): Observable<CityWeatherDto> {
    const requestBody = { cityName };
    return this.http.post<CityWeatherDto>(this.apiUrl, requestBody);
  }

  removeFromFavorites(cityId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${cityId}`);
  }
}