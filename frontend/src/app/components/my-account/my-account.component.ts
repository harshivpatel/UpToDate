import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-my-account',
  standalone: true,
  imports: [CommonModule, RouterModule,SidebarComponent],
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent {
  
  isDarkMode = false;

  toggleDarkMode(): void {
    document.body.classList.toggle('dark-theme');
    this.isDarkMode = !this.isDarkMode;
  }

  setDarkMode(): void {
    document.body.classList.add('dark-theme');
    localStorage.setItem('theme', 'dark');
  }
  
  setLightMode(): void {
    document.body.classList.remove('dark-theme');
    localStorage.setItem('theme', 'light');
  }
  onCategoriesChanged(categories: string[]): void {
    
  }
  
}
