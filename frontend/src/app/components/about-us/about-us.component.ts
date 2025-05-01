import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [CommonModule, SidebarComponent, RouterModule],
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent {
  onCategoriesChanged(categories: string[]): void {
    
  }
}
