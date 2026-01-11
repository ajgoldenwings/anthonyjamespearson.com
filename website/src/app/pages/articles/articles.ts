import { Component, OnInit } from '@angular/core';
import { MarkdownModule } from 'ngx-markdown';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ArticleService } from '../../services/article.service';
import { Article } from '../../models/article.model';
import { DateFormatPipe } from '../../pipes/date-format.pipe';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.html',
  imports: [
    MarkdownModule,
    RouterLink,
    CommonModule,
    DateFormatPipe,
    FormsModule
  ],
})
export class Articles implements OnInit {
  articles: Article[] = [];
  filteredArticles: Article[] = [];
  searchQuery: string = '';

  constructor(
    private articleService: ArticleService,
    private meta: Meta,
    private title: Title
  ) {}

  ngOnInit() {
    this.articles = this.articleService.getAllArticles();
    this.filteredArticles = this.articles;
    this.updateSEOTags();
  }

  onSearch() {
    this.filteredArticles = this.articleService.searchArticles(this.searchQuery);
  }

  clearSearch() {
    this.searchQuery = '';
    this.filteredArticles = this.articles;
  }

  private updateSEOTags() {
    const pageTitle = 'Articles | Anthony James Pearson - Software Development Blog';
    const description = 'Technical articles and tutorials about .NET, AWS, Angular, React, and modern web development by Anthony James Pearson. Learn about software engineering, cloud architecture, and AI integration.';

    this.title.setTitle(pageTitle);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: pageTitle });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: 'https://anthonyjamespearson.com/articles' });
    this.meta.updateTag({ name: 'twitter:title', content: pageTitle });
    this.meta.updateTag({ name: 'twitter:description', content: description });
  }
}
