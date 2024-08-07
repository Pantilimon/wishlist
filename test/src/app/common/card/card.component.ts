import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
@Component({
  selector: 'app-card',
  standalone: true,
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})

export class CardComponent {
  @Input() data: any;
  @Output() delete = new EventEmitter<string>();
  @Output() edit = new EventEmitter<string>();

  constructor(private sanitizer: DomSanitizer) {}

  getText(): SafeHtml {
    if (this.data.content.data && this.data.content.data.blocks) {
      const paragraphBlocks = this.data.content.data.blocks
        .filter((block: any) => block.type === 'paragraph')
        .map((block: any) => block.data.text);

      const htmlString = paragraphBlocks.join('<br>');
      return this.sanitizer.bypassSecurityTrustHtml(htmlString
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&'));
    }
    return this.sanitizer.bypassSecurityTrustHtml('');
  }
  getFormattedDate(): string {
    if (this.data && this.data.content.time) {
      const date = new Date(this.data.content.time);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    }
    return '';
  }
  onDelete(): void {
    this.delete.emit(this.data.key);
  }
  onEdit(): void {
    this.edit.emit(this.data.key);
  }
}