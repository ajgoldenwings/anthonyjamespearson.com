import { RenderMode, ServerRoute } from '@angular/ssr';
import { ArticleService } from './services/article.service';
import { inject } from '@angular/core';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'articles/:id',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => {
      const articleService = inject(ArticleService);
      const articles = articleService.getAllArticles();

      return articles.map(a => ({ id: a.id }));
    },
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
