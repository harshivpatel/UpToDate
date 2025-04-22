import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { NewsService } from '../../services/news.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})

export class SearchComponent implements OnInit {
  searchResults: any[] = [];
  query: string = '';
  categories: string[] = ['General', 'Sports', 'Technology', 'Health', 'Science', 'Business', 'Entertainment'];
  isDarkMode : boolean = false;

  constructor(
    private route: ActivatedRoute,
    private newsService: NewsService
  ) {
    this.route.queryParams.subscribe(params => {
      this.query = params['q'] || '';
      if (this.query) this.searchArticles();
    });
  }
  ngOnInit(): void {
    this.isDarkMode = document.body.classList.contains('dark-theme');
  
    
    const observer = new MutationObserver(() => {
      this.isDarkMode = document.body.classList.contains('dark-theme');
    });
  
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  }
  

  searchArticles(): void {
    this.newsService.searchNews(this.query).subscribe((data) => {
      this.searchResults = data.articles || [];
    });
  }
}
  