import { Component, OnInit } from '@angular/core';
import { NewsService } from '../../services/news.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {
  newsArticles: any[] = [];

  constructor(private newsService: NewsService) {}

  ngOnInit(): void {
    this.newsService.getNews().subscribe(
      (data) => {
        this.newsArticles = data.articles;
      },
      (error) => {
        console.log('Error fetching news:', error);
      }
    );
  }
}
