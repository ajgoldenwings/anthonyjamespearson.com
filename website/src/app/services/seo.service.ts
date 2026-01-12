import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT } from '@angular/common';

export interface SEOData {
  title: string;
  description: string;
  keywords: string;
  url?: string;
  image?: string;
  type?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SEOService {
  private defaultImage = 'https://anthonyjamespearson.com/images/image-1200x630.jpg';
  private defaultUrl = 'https://anthonyjamespearson.com';

  constructor(
    private meta: Meta,
    private title: Title,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document
  ) {}

  updateSEOData(data: SEOData) {
    // Update page title
    this.title.setTitle(data.title);

    // Update meta description
    this.meta.updateTag({ name: 'description', content: data.description });
    this.meta.updateTag({ name: 'keywords', content: data.keywords });

    // Update Open Graph tags
    this.meta.updateTag({ property: 'og:title', content: data.title });
    this.meta.updateTag({ property: 'og:description', content: data.description });
    this.meta.updateTag({ property: 'og:url', content: data.url || this.defaultUrl });
    this.meta.updateTag({ property: 'og:image', content: data.image || this.defaultImage });
    this.meta.updateTag({ property: 'og:type', content: data.type || 'website' });

    // Update Twitter Card tags
    this.meta.updateTag({ name: 'twitter:title', content: data.title });
    this.meta.updateTag({ name: 'twitter:description', content: data.description });
    this.meta.updateTag({ name: 'twitter:image', content: data.image || this.defaultImage });

    // Update canonical URL
    this.updateCanonicalUrl(data.url || this.defaultUrl);
  }

  private updateCanonicalUrl(url: string) {
    // Only run in browser environment
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Remove existing canonical link
    const existingCanonical = this.document.querySelector('link[rel="canonical"]');
    if (existingCanonical) {
      existingCanonical.remove();
    }

    // Add new canonical link
    const link = this.document.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', url);
    this.document.head.appendChild(link);
  }

  addStructuredData(data: any, id?: string) {
    // Only run in browser environment
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Remove existing structured data with the same ID
    if (id) {
      const existing = this.document.querySelector(`script[type="application/ld+json"][data-id="${id}"]`);
      if (existing) {
        existing.remove();
      }
    }

    // Add new structured data
    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    if (id) {
      script.setAttribute('data-id', id);
    }
    script.textContent = JSON.stringify(data);
    this.document.head.appendChild(script);
  }
}
