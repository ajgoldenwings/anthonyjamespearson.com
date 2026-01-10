import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ArticleService } from '../../services/article.service';
import { Article } from '../../models/article.model';
import { DateFormatPipe } from '../../pipes/date-format.pipe';

@Component({
  selector: 'app-home',
  imports: [RouterLink, CommonModule, DateFormatPipe],
  templateUrl: './home.html',
})
export class Home implements OnInit {
  latestArticle: Article | null = null;

  constructor(private articleService: ArticleService) {}

  ngOnInit() {
    this.latestArticle = this.articleService.getLatestArticle();
  }
}
