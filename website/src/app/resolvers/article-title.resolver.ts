import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';

export const articleTitleResolver: ResolveFn<string> = (route) => {
  const articleId = route.paramMap.get('id');

  if (!articleId) {
    return 'Anthony – Article';
  }

  // Remove date prefix (YYYY-MM-DD_) and replace dashes/underscores with spaces
  const titlePart = articleId.replace(/^\d{4}-\d{2}-\d{2}_/, '');
  const formattedTitle = titlePart.replace(/[-_]/g, ' ');

  return `Anthony – ${formattedTitle}`;
};
