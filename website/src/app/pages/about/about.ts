import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.html',
})
export class About {
  showBlurredImage = true;

  onImageLoad(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.classList.remove('opacity-0');
    img.classList.add('opacity-100');
    this.showBlurredImage = false;
  }
}
