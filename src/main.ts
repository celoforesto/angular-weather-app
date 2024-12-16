import { bootstrapApplication } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { WeatherService } from './app/services/weather.service';
import { WeatherState } from './app/state/weather.state';
import { importProvidersFrom } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './app/services/auth.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    WeatherService,
    WeatherState,
    importProvidersFrom(BrowserAnimationsModule),
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
  ],
}).catch((err) => console.error(err));