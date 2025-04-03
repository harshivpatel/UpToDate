import { Component, OnInit } from '@angular/core';
import { NewsService } from '../../services/news.service.spec';

@Component({
  selector: 'app-news',
  imports: [],
  templateUrl: './news.component.html',
  styleUrl: './news.component.css'
})
export class NewsComponent implements OnInit {
  newsArticles: any[] = [];

  constructor(private newsService: NewsService) {}

  ngOnInit(): void {
      this.newsService.getNews().subscribe(
        data => {
          this.newsArticles = data.articles;
        },
        error => {
          console.log('Error fetching news:', error);
        }
      )
  }
}
