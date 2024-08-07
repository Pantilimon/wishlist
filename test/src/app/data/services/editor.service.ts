import { Injectable } from '@angular/core';
import EditorJS from '@editorjs/editorjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class EditorService { 
  private editor: EditorJS | null = null;

  constructor() { }
  //метод инициализации эдитора
  initEditor(): void {
    this.editor = new EditorJS({
      minHeight: 0,
      holder: 'Descriptions',  // ID элемента, в который будет встроен Editor.js
      tools: {
        // Здесь можно добавить необходимые инструменты
      }
    });
  }
 // Данные, полученные из эдитора, сохраняем  в localStorage
  async saveContent(): Promise<void> {
    if (this.editor) {
      const uniqueId = uuidv4(); // Генерация уникального идентификатора
      const outputData = await this.editor.save(); // Получение данных из редактора
      const dataWithTimestamp = {
        data: outputData,
        time: new Date().toISOString() // Добавление времени сохранения
      };
      localStorage.setItem(uniqueId, JSON.stringify(dataWithTimestamp));
    }
  }

  //метод. Обновляем данные, так же новые данные получаем из editor
  async updateContent(key: string): Promise<void> {
    if (this.editor) {
      const outputData = await this.editor.save();
      const dataWithTimestamp = {
        data: outputData,
        time: new Date().toISOString() // Обновление времени сохранения
      };
      localStorage.setItem(key, JSON.stringify(dataWithTimestamp));
    }
  }
  
  getAllKeys(): string[] {
    return Object.keys(localStorage);
  }

  getContent(key: string): any {
    const content = localStorage.getItem(key);
    return content ? (JSON.parse(content)) : "False!";
  }


  delContent(key: string): void {
    localStorage.removeItem(key);
  }
  loadContent(data: any): void {
    if (this.editor) {
      this.editor.render(data);
    }
  }
}