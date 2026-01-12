import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

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
    private title: Title
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
    // Remove existing canonical link
    const existingCanonical = document.querySelector('link[rel="canonical"]');
    if (existingCanonical) {
      existingCanonical.remove();
    }

    // Add new canonical link
    const link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', url);
    document.head.appendChild(link);
  }

  addStructuredData(data: any, id?: string) {
    // Remove existing structured data with the same ID
    if (id) {
      const existing = document.querySelector(`script[type="application/ld+json"][data-id="${id}"]`);
      if (existing) {
        existing.remove();
      }
    }

    // Add new structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    if (id) {
      script.setAttribute('data-id', id);
    }
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  }
}
