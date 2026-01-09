import { ApplicationConfig, provideBrowserGlobalErrorListeners, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { MarkdownModule, SANITIZE } from 'ngx-markdown';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

// Custom sanitizer function for YouTube iframes
function customSanitize(html: string): string {
  // Allow YouTube iframe embeds while maintaining security for other content
  const youtubeIframeRegex = /<iframe[^>]*src="https:\/\/www\.youtube\.com\/embed\/[^"]*"[^>]*><\/iframe>/gi;

  if (html.match(youtubeIframeRegex)) {
    return html;
  }

  // For other content, use default sanitization (remove iframes)
  return html.replace(/<iframe[^>]*>.*?<\/iframe>/gi, '');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch()),
    importProvidersFrom(MarkdownModule.forRoot({
      loader: HttpClient,
      sanitize: {
        provide: SANITIZE,
        useValue: customSanitize,
      },
    }))
  ]
};
