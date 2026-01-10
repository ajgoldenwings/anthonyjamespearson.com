import { Component, OnInit } from '@angular/core';
import { MarkdownModule } from 'ngx-markdown';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ArticleService } from '../../services/article.service';
import { Article } from '../../models/article.model';
import { DateFormatPipe } from '../../pipes/date-format.pipe';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.html',
  imports: [
    MarkdownModule,
    RouterLink,
    CommonModule,
    DateFormatPipe
  ],
})
export class Articles implements OnInit {
  articles: Article[] = [];

  constructor(private articleService: ArticleService) {}

  ngOnInit() {
    this.articles = this.articleService.getAllArticles();
  }
}
