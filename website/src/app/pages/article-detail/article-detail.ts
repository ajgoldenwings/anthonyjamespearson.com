import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.html',
  imports: [MarkdownModule, CommonModule]
})
export class ArticleDetail implements OnInit {
  articlePath: string = '';
  articleNotFound: boolean = false;
  articleDate: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const articleId = params['id'];
      if (articleId) {
        this.articlePath = `/articles/${articleId}.md`;
        this.extractArticleInfo(articleId);
      } else {
        this.articleNotFound = true;
      }
    });
  }

  private extractArticleInfo(articleId: string) {
    // Extract date from format: YYYY-MM-DD_Title
    const dateMatch = articleId.match(/^(\d{4})-(\d{2})-(\d{2})_/);

    if (dateMatch) {
      const [, year, month, day] = dateMatch;
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

      // Format date as "Month DD, YYYY"
      this.articleDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  }

  onMarkdownError() {
    this.articleNotFound = true;
  }

  goBack() {
    this.router.navigate(['/articles']);
  }
}
