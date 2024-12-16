import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-weather-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './weather-card.component.html',
  styleUrls: ['./weather-card.component.css'],
})
export class WeatherCardComponent {
  @Input() isFavorite: boolean = false;
  @Input() cityName!: string;
  @Input() weatherDescription!: string;
  @Input() icon!: string;
  @Input() temperature!: number;
  @Input() minTemperature!: number;
  @Input() maxTemperature!: number;
  @Input() humidity!: number;
  @Input() forecastData: { date: string; weatherIcon: string; minTemperature: number; maxTemperature: number }[] | null = null;
  @Input() showHighlightButton = false;
  @Input() isHighlighted = false;

  @Output() highlightCity = new EventEmitter<void>();
  @Output() clearHighlight = new EventEmitter<void>();
  @Output() toggleForecast = new EventEmitter<void>();
  @Output() toggleFavorite = new EventEmitter<void>();

  onHighlightCity() {
    this.highlightCity.emit();
  }

  onClearHighlight() {
    this.clearHighlight.emit();
  }

  onToggleForecast() {
    this.toggleForecast.emit();
  }
}