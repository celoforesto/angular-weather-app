import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FavoritesService } from '../services/favorites.service';
import { CityWeatherDto } from '../models/city-weather.model';

@Injectable({
  providedIn: 'root',
})
export class WeatherState {
  private favoritesSubject = new BehaviorSubject<CityWeatherDto[]>([]);
  favorites$ = this.favoritesSubject.asObservable();

  constructor(private favoritesService: FavoritesService) {
    this.loadFavoritesFromStorage();
    this.refreshFavorites();
  }

  private loadFavoritesFromStorage(): void {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    this.favoritesSubject.next(storedFavorites);
  }

  private saveFavoritesToStorage(favorites: CityWeatherDto[]): void {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }

  getFavorites(): CityWeatherDto[] {
    return this.favoritesSubject.value;
  }  

  isCityFavorite(cityName: string): boolean {
    const favorites = this.favoritesSubject.value;
    return favorites.some((fav) => fav.cityName.toLowerCase() === cityName.toLowerCase());
  }  

  refreshFavorites(): void {
    this.favoritesService.getFavoritesWithWeather().subscribe({
      next: (favoritesWithWeather) => {
        this.favoritesSubject.next(favoritesWithWeather);
        this.saveFavoritesToStorage(favoritesWithWeather);
      },
      error: () => console.error('Erro ao carregar favoritos com clima.'),
    });
  }
  

  addFavorite(cityName: string): void {
    this.favoritesService.addToFavorites(cityName).subscribe({
      next: (newFavorite) => {
        const updatedFavorites = [...this.favoritesSubject.value, newFavorite];
        this.refreshFavorites();
      },
      error: () => console.error('Erro ao adicionar cidade aos favoritos.'),
    });
  }

  removeFavorite(cityId: string): void {
    this.favoritesService.removeFromFavorites(cityId).subscribe({
      next: () => {
        const updatedFavorites = this.favoritesSubject.value.filter(
          (fav) => fav.cityId !== cityId
        );
        this.favoritesSubject.next(updatedFavorites);
        this.saveFavoritesToStorage(updatedFavorites);
      },
      error: () => console.error('Erro ao remover cidade dos favoritos.'),
    });
  }

  reorderFavorites(previousIndex: number, currentIndex: number): void {
    const favorites = [...this.favoritesSubject.value];
    const [movedCity] = favorites.splice(previousIndex, 1);
    favorites.splice(currentIndex, 0, movedCity);

    // Atualiza o estado e persiste as alterações no localStorage
    this.favoritesSubject.next(favorites);
    this.saveFavoritesToStorage(favorites);
  }
}