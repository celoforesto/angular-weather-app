import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { WeatherService } from '../../services/weather.service';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WeatherState } from '../../state/weather.state';
import { CityWeatherDto } from '../../models/city-weather.model';
import { FiveDayForecastDto } from '../../models/forecast-day.model';
import { WeatherCardComponent } from '../../shared/components/weather-card/weather-card.component';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    WeatherCardComponent
  ],
})
export class SearchComponent implements OnInit {
  city: string = '';
  weather: CityWeatherDto | null = null;
  forecast: FiveDayForecastDto | null = null;
  showForecast: boolean = false;
  loading: boolean = false;
  isFavorite: boolean = false;

  constructor(
    private weatherService: WeatherService,
    private weatherState: WeatherState,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  searchCity(): void {
    if (!this.city.trim()) {
      this.snackBar.open('Por favor, insira o nome de uma cidade.', 'Fechar', {
        duration: 3000,
      });
      return;
    }

    this.loading = true;
    this.weatherService.getWeatherByCity(this.city.trim()).subscribe({
      next: (data) => {
        this.weather = data;
        this.checkIfCityIsFavorite(data.cityName);
        this.loading = false;
        this.forecast = null;
      },
      error: () => {
        this.snackBar.open(
          'Erro ao buscar dados climáticos. Verifique o nome da cidade.',
          'Fechar',
          { duration: 3000 }
        );
        this.loading = false;
      },
    });
  }

  fetchForecast(): void {
    if (!this.city.trim()) return;

    this.weatherService.getFiveDayForecast(this.city.trim()).subscribe({
      next: (forecast) => {
        this.forecast = forecast;
      },
      error: () => {
        this.snackBar.open('Erro ao buscar previsão de 5 dias.', 'Fechar', {
          duration: 3000,
        });
      },
    });
  }

  checkIfCityIsFavorite(cityName: string): void {
    this.weatherState.favorites$.subscribe((favorites) => {
      this.isFavorite = favorites.some(
        (fav) => fav.cityName.toLowerCase() === cityName.toLowerCase()
      );
    });
  }

  toggleFavorite(): void {
    if (this.weather) {
      if (this.isFavorite) {
        this.weatherState.favorites$.subscribe((favorites) => {
          const favoriteCity = favorites.find(
            (fav) =>
              fav.cityName.toLowerCase() ===
              this.weather!.cityName.toLowerCase()
          );
          if (favoriteCity) {
            this.weatherState.removeFavorite(favoriteCity.cityId);
            this.snackBar.open('Cidade removida dos favoritos.', 'Fechar', {
              duration: 3000,
            });
          }
        }).unsubscribe();
      } else {
        this.weatherState.addFavorite(this.weather.cityName);
        this.snackBar.open('Cidade adicionada aos favoritos.', 'Fechar', {
          duration: 3000,
        });
      }
      this.checkIfCityIsFavorite(this.weather.cityName);
    }
  }

  toggleForecastVisibility(): void {
    this.showForecast = !this.showForecast;
  
    if (!this.showForecast) {
      this.forecast = null;
    } else if (!this.forecast) {
      this.fetchForecast();
    }
  }
  

  onToggleFavorite(cityName: string): void {
    const favorites = this.weatherState.getFavorites();
    if (this.weatherState.isCityFavorite(cityName)) {
      const cityId = favorites.find((fav) => fav.cityName.toLowerCase() === cityName.toLowerCase())?.cityId;
      if (cityId) {
        this.weatherState.removeFavorite(cityId);
      }
    } else {
      this.weatherState.addFavorite(cityName);
    }
  }

  isCityFavorite(cityName: string): boolean {
    return this.weatherState.isCityFavorite(cityName);
  }
}