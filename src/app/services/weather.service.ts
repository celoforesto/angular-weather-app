import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { CityWeatherDto } from '../models/city-weather.model';
import { FiveDayForecastDto } from '../models/forecast-day.model';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private readonly apiUrl = `${environment.apiUrl}/api/weather`;

  constructor(private http: HttpClient) {}

  getWeatherByCity(cityName: string): Observable<CityWeatherDto> {
    return this.http.get<CityWeatherDto>(`${this.apiUrl}/current/${cityName}`);
  }

  getFiveDayForecast(cityName: string): Observable<FiveDayForecastDto> {
    return this.http.get<FiveDayForecastDto>(`${this.apiUrl}/forecast/${cityName}`);
  }  
}