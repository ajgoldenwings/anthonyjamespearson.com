import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ArticleService } from '../../services/article.service';
import { Article } from '../../models/article.model';
import { DateFormatPipe } from '../../pipes/date-format.pipe';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  imports: [RouterLink, CommonModule, DateFormatPipe],
  templateUrl: './home.html',
})
export class Home implements OnInit {
  latestArticle: Article | null = null;

  constructor(
    private articleService: ArticleService,
    private meta: Meta,
    private title: Title
  ) {}

  ngOnInit() {
    this.latestArticle = this.articleService.getLatestArticle();
    this.updateSEOTags();
  }

  private updateSEOTags() {
    const pageTitle = 'Anthony James Pearson - Senior .NET/AWS Engineer & Full-Stack Developer';
    const description = 'Senior .NET/AWS Engineer with 10+ years experience in full-stack development, microservices, cloud architecture, and AI integration. Expert in Angular, Vue, and modern web technologies.';

    this.title.setTitle(pageTitle);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: pageTitle });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: 'https://anthonyjamespearson.com' });
    this.meta.updateTag({ name: 'twitter:title', content: pageTitle });
    this.meta.updateTag({ name: 'twitter:description', content: description });
  }
}
