import { Component } from '@angular/core';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.html',
  imports: [
    MarkdownModule
  ],
})
export class Posts {
}
