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

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const articleId = params['id'];
      if (articleId) {
        this.articlePath = `/articles/${articleId}.md`;
      } else {
        this.articleNotFound = true;
      }
    });
  }

  onMarkdownError() {
    this.articleNotFound = true;
  }

  goBack() {
    this.router.navigate(['/articles']);
  }
}
