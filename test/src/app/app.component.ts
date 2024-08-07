import { Component, OnInit  } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CardComponent } from './common/card/card.component';
import { EditorService } from './data/services/editor.service';
import { CommonModule } from '@angular/common';


//Стандатное подключение компонентов
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CardComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent{
  showCreateForm = false; // Свойство, значение котрого влиет на то, какие блоки видно на app.component.html, а какие нет(скрывает форму)
  editingKey: string | null = null; // если не 0, то метод saveContent будет обновлять одну из записей с соотвестствующим id 
  title = 'test';
  allKeys: string[] = []; //Вспомогательное свойство для дальнейшего вывода записей, хранит все ключи от localStorage
  allData: { key: string, content: any }[] = []; //Все значения в localStorage

  constructor(private editorService: EditorService) {}

// Большинство меодов используют методы сервиса, этот компонентсвоего рода контроллер для всего "проекта"


  // метод. Инициализируем Editor из сервиса
  ngOnInit(): void {          
    this.editorService.initEditor();
    this.loadAllData();
  }

  //метод. Сохраняем значение, которое сейчас набранов Editor (если editingKey !=, то обновляем запись по id=editingKey)
  async saveContent(): Promise<void> {
    if (this.editingKey) {
      await this.editorService.updateContent(this.editingKey);
      this.editingKey = null;
    } else {
      await this.editorService.saveContent();
    }
    this.loadAllData(); // Обновляем список записей
  }

  //метод. меняет значения скрытых блоков на открыте (показывает форму и скрывает кнопку "создать запись")
  toggleCreateForm() {
    this.showCreateForm = !this.showCreateForm;
    if (this.showCreateForm) {
      setTimeout(() => this.editorService.initEditor(), 1);
    }
  }
  //метод. Проверка, открыта ли форма (например, если форма закрыта и мы хотим изменить записьЮ, надо снвоа открыть форму)
  openCreateForm(): void {
    if (!this.showCreateForm) {
      this.toggleCreateForm();
    }
  }

  //метод. Меняем данные в запси на те, которые в Editor
  editContent(key: string): void {
    this.openCreateForm();
    const content = this.editorService.getContent(key);
    if (content) {
      this.editingKey = key;
      this.editorService.loadContent(content.data);
    }
  }

  //метод. Удаляем запись 
  delContent(key: string): void {
    this.editorService.delContent(key);
    this.loadAllData(); // Обновляем список записей
  }

  //метод. Обновляем список записей
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
