import { Component } from '@angular/core';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.html',
  imports: [
    MarkdownModule
  ],
})
export class Articles {
}
