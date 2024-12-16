export interface ForecastDayDto {
    date: string;
    minTemperature: number;
    maxTemperature: number;
    weatherIcon: string;
  }
  
  export interface FiveDayForecastDto {
    cityName: string;
    forecastDays: ForecastDayDto[];
  }  