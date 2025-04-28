import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-news-sort',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './news-sort.component.html',
  styleUrls: ['./news-sort.component.css']
})
export class NewsSortComponent {
  categories = ['General', 'Sports', 'Technology', 'Health', 'Science', 'Business', 'Entertainment'];
  selectedCategories: string[] = [];

  @Output() filterChange = new EventEmitter<string[]>();

  toggleCategory(category: string) {
    const index = this.selectedCategories.indexOf(category);
    if (index > -1) {
      this.selectedCategories.splice(index, 1);
    } else {
      this.selectedCategories.push(category);
    }
    this.filterChange.emit(this.selectedCategories);
  }
}
