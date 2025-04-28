import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  availableCategories: string[] = ['General', 'Sports', 'Technology', 'Health', 'Science', 'Business', 'Entertainment'];
  selectedCategories: string[] = [];

  @Output() categoriesChanged = new EventEmitter<string[]>();

  onCategoryToggle(category: string, event: Event) {
    const checkbox = event.target as HTMLInputElement;
    
    if (checkbox.checked) {
      this.selectedCategories.push(category);
    } else {
      this.selectedCategories = this.selectedCategories.filter(c => c !== category);
    }

    this.categoriesChanged.emit(this.selectedCategories);
  }
}
