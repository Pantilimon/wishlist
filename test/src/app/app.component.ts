import { Component, OnInit  } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CardComponent } from './common/card/card.component';
import { EditorService } from './data/services/editor.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CardComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  showCreateForm = false;
  editingKey: string | null = null;
  title = 'test';
  allKeys: string[] = [];
  allData: { key: string, content: any }[] = [];

  constructor(private editorService: EditorService) {}

  ngOnInit(): void {
    this.editorService.initEditor();
    this.loadAllData();
  }
  async saveContent(): Promise<void> {
    if (this.editingKey) {
      await this.editorService.updateContent(this.editingKey);
      this.editingKey = null;
    } else {
      await this.editorService.saveContent();
    }
    this.loadAllData(); // Обновляем список записей
  }
  openCreateForm(): void {
    if (!this.showCreateForm) {
      this.toggleCreateForm();
    }
  }
  // qw
  editContent(key: string): void {
    this.openCreateForm();
    const content = this.editorService.getContent(key);
    if (content) {
      this.editingKey = key;
      this.editorService.loadContent(content.data);
    }
  }
  toggleCreateForm() {
    this.showCreateForm = !this.showCreateForm;
    if (this.showCreateForm) {
      setTimeout(() => this.editorService.initEditor(), 1);
    }
  }

  delContent(key: string): void {
    this.editorService.delContent(key);
    this.loadAllData(); // Обновляем список записей
  }
  loadAllData(): void {
    this.allKeys = this.editorService.getAllKeys();
    this.allData = [];
  
    this.allKeys.forEach(key => {
      const data = this.editorService.getContent(key);
      if (data) {
        this.allData.push({key, content: data});
      }
    });
  
    // Сортируем данные по дате
    this.allData.sort((a, b) => new Date(b.content.time).getTime() - new Date(a.content.time).getTime());
  }

}
