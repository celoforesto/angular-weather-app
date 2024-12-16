import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule,
    MatMenuModule,
    CommonModule,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'WeatherApp';
  isDarkTheme = false;
  currentRoute: string = '';

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url;
    });

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.isDarkTheme = savedTheme === 'dark';
      const themeClass = this.isDarkTheme ? 'dark-theme' : 'light-theme';
      document.body.classList.add(themeClass);
    } else {
      this.isDarkTheme = false;
      document.body.classList.add('light-theme');
    }
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    const themeClass = this.isDarkTheme ? 'dark-theme' : 'light-theme';
    
    document.body.classList.remove('dark-theme', 'light-theme');
    
    document.body.classList.add(themeClass);

    localStorage.setItem('theme', this.isDarkTheme ? 'dark' : 'light');
  }
}