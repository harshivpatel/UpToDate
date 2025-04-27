import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RightbarComponent } from '../rightbar/rightbar.component';

@Component({
  selector: 'app-news-sort',
  standalone: true,
  imports: [CommonModule, RightbarComponent],
  templateUrl: './news-sort.component.html',
  styleUrls: ['./news-sort.component.css']
})
export class NewsSortComponent {
  categories = [
    'General', 'Sports', 'Technology', 'Health', 'Science', 'Business', 'Entertainment'
  ];

  selectedCategories: Set<string> = new Set();
  sortOption: string = '';

  @Output() filtersChanged = new EventEmitter<{ categories: string[], sort: string }>();

  toggleCategory(cat: string) {
    if (this.selectedCategories.has(cat)) {
      this.selectedCategories.delete(cat);
    } else {
      this.selectedCategories.add(cat);
    }
    this.emitChanges();
  }

  isSelected(category: string): boolean {
    return this.selectedCategories.has(category);
  }

  changeSortOption(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.sortOption = target.value;
    this.emitChanges();
  }
  

  emitChanges() {
    this.filtersChanged.emit({
      categories: Array.from(this.selectedCategories),
      sort: this.sortOption
    });
  }
}
