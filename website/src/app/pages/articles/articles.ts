import { Component, OnInit } from '@angular/core';
import { MarkdownModule } from 'ngx-markdown';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
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
    private title: Title,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.articles = this.articleService.getAllArticles();

    // Subscribe to query parameter changes
    this.route.queryParams.subscribe(params => {
      const searchTerm = params['search'] || '';
      this.searchQuery = searchTerm;
      this.performSearch();
      this.updateSEOTags();
    });
  }

  onSearch() {
    // Update URL with search parameter
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { search: this.searchQuery || null },
      queryParamsHandling: 'merge'
    });
  }

  clearSearch() {
    this.searchQuery = '';
    // Remove search parameter from URL
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { search: null },
      queryParamsHandling: 'merge'
    });
  }

  private performSearch() {
    this.filteredArticles = this.articleService.searchArticles(this.searchQuery);
  }

  private updateSEOTags() {
    let pageTitle = 'Articles | Anthony James Pearson - Software Development Blog';
    let description = 'Technical articles and tutorials about .NET, AWS, Angular, React, and modern web development by Anthony James Pearson. Learn about software engineering, cloud architecture, and AI integration.';

    // Update SEO for search results
    if (this.searchQuery) {
      pageTitle = `Search: "${this.searchQuery}" | Articles | Anthony James Pearson`;
      description = `Search results for "${this.searchQuery}" - Find articles about ${this.searchQuery} and related topics in software development.`;
    }

    this.title.setTitle(pageTitle);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: pageTitle });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: `https://anthonyjamespearson.com/articles${this.searchQuery ? '?search=' + encodeURIComponent(this.searchQuery) : ''}` });
    this.meta.updateTag({ name: 'twitter:title', content: pageTitle });
    this.meta.updateTag({ name: 'twitter:description', content: description });
  }
}
