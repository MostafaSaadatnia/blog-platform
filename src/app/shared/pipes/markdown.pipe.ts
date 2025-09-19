import { Pipe, PipeTransform } from '@angular/core';
import { marked } from 'marked';

@Pipe({ name: 'markdown', standalone: true, pure: true })
export class MarkdownPipe implements PipeTransform {
  transform(src?: string): string {
    return marked.parse(src ?? '', {
      gfm: true,
      breaks: true,
    }) as string;
  }
}