import { Component, OnInit, Renderer2 } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  constructor(private renderer: Renderer2) {}

  title = 'calendar-app';

  ngOnInit(): void {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
      this.renderer.addClass(document.body, 'dark-mode');
    }
  }
}
