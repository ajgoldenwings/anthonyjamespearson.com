import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { CommonModule } from '@angular/common';
import { DateFormatPipe } from '../../pipes/date-format.pipe';

@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.html',
  imports: [MarkdownModule, CommonModule, DateFormatPipe]
})
export class ArticleDetail implements OnInit {
  articlePath: string = '';
  articleNotFound: boolean = false;
  articleDate: string = '';
  articleTitle: string = '';

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
      // Store the raw date string for the pipe to format
      this.articleDate = `${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]}`;

      // Extract title part (after date prefix)
      const titlePart = articleId.replace(/^\d{4}-\d{2}-\d{2}_/, '');
      this.articleTitle = titlePart.replace(/[-_]/g, ' ');
    }
  }

  onMarkdownError() {
    this.articleNotFound = true;
  }

  goBack() {
    this.router.navigate(['/articles']);
  }
}
