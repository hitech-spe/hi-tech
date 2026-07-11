import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NewsService, NewsItem } from '../../services/news.service';

@Component({
  selector: 'app-insights',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './insights.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./insights.component.scss']
})
export class InsightsComponent implements OnInit {
  newsItems: NewsItem[] = [];

  constructor(private newsService: NewsService) {}

  ngOnInit(): void {
    this.newsItems = this.newsService.getNews();
  }
}
