import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { CommonModule } from '@angular/common';
import { DateFormatPipe } from '../../pipes/date-format.pipe';
import { Meta, Title } from '@angular/platform-browser';
import { ArticleService } from '../../services/article.service';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';

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
    private router: Router,
    private meta: Meta,
    private title: Title,
    private articleService: ArticleService,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const articleId = params['id'];
      if (articleId) {
        this.articlePath = `/articles/${articleId}.md`;
        this.extractArticleInfo(articleId);
        this.updateSEOTags(articleId);
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

  private updateSEOTags(articleId: string) {
    const article = this.articleService.getArticleById(articleId);

    if (article) {
      const pageTitle = `${article.title} | Anthony James Pearson`;
      const description = article.description;
      const url = `https://anthonyjamespearson.com/articles/${articleId}`;

      // Update page title
      this.title.setTitle(pageTitle);

      // Update meta description
      this.meta.updateTag({ name: 'description', content: description });

      // Update Open Graph tags
      this.meta.updateTag({ property: 'og:title', content: pageTitle });
      this.meta.updateTag({ property: 'og:description', content: description });
      this.meta.updateTag({ property: 'og:url', content: url });
      this.meta.updateTag({ property: 'og:type', content: 'article' });

      // Update Twitter Card tags
      this.meta.updateTag({ name: 'twitter:title', content: pageTitle });
      this.meta.updateTag({ name: 'twitter:description', content: description });

      // Add article-specific structured data
      this.addArticleStructuredData(article, url);
    }
  }

  private addArticleStructuredData(article: any, url: string) {
    // Only run in browser environment
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": article.title,
      "description": article.description,
      "author": {
        "@type": "Person",
        "name": "Anthony James Pearson",
        "url": "https://anthonyjamespearson.com"
      },
      "publisher": {
        "@type": "Person",
        "name": "Anthony James Pearson"
      },
      "datePublished": article.date,
      "dateModified": article.date,
      "url": url,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": url
      }
    };

    // Remove existing structured data script if any
    const existingScript = this.document.querySelector('script[type="application/ld+json"][data-article]');
    if (existingScript) {
      existingScript.remove();
    }

    // Add new structured data
    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-article', 'true');
    script.textContent = JSON.stringify(structuredData);
    this.document.head.appendChild(script);
  }

  onMarkdownError() {
    this.articleNotFound = true;
  }

  goBack() {
    this.router.navigate(['/articles']);
  }
}
