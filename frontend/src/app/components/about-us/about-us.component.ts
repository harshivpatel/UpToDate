import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent {
  onCategoriesChanged(categories: string[]): void {
    
  }
}
