import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { WeatherState } from '../../state/weather.state';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CityWeatherDto } from '../../models/city-weather.model';
import { ForecastDayDto } from '../../models/forecast-day.model';
import { WeatherService } from '../../services/weather.service';
import { WeatherCardComponent } from '../../shared/components/weather-card/weather-card.component';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    DragDropModule,
    WeatherCardComponent
  ],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css'],
})
export class FavoritesComponent implements OnInit {
  favorites$: Observable<CityWeatherDto[]>;
  highlightedCityId: string | null = null;
  forecastData: { [cityId: string]: ForecastDayDto[] } = {};

  constructor(private weatherState: WeatherState, private weatherService: WeatherService) {
    this.favorites$ = this.weatherState.favorites$;
  }

  ngOnInit(): void {
    this.loadHighlightedCity();
  }

  showFiveDayForecast(cityId: string, cityName: string): void {
    if (!this.forecastData[cityId]) {
      this.weatherService.getFiveDayForecast(cityName).subscribe((forecast) => {
        this.forecastData[cityId] = forecast.forecastDays;
      });
    } else {
      delete this.forecastData[cityId];
    }
  }  

  removeCity(cityId: string): void {
    this.weatherState.removeFavorite(cityId);
    if (this.highlightedCityId === cityId) {
      this.clearHighlight();
    }
  }

  highlightCity(cityId: string): void {
    this.highlightedCityId = cityId;
    localStorage.setItem('highlightedCityId', cityId);
  }

  clearHighlight(): void {
    this.highlightedCityId = null;
    localStorage.removeItem('highlightedCityId');
  }

  drop(event: any): void {
    this.weatherState.reorderFavorites(event.previousIndex, event.currentIndex);
  }

  private loadHighlightedCity(): void {
    this.highlightedCityId = localStorage.getItem('highlightedCityId');
  }
}