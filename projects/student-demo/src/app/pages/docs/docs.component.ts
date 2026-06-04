import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Section { id: string; label: string; }

@Component({
  selector: 'app-docs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './docs.component.html',
  styleUrl: './docs.component.scss',
})
export class DocsComponent {
  activeSection = 'install';

  // code snippets ที่มี {{ }} ต้องเก็บเป็น property แล้วใช้ [textContent]
  readonly thaiDatePipeCode =
    `{{ myDate | thaiDate:'medium' }}\n{{ myDate | thaiDate:'long' }}`;
  readonly thaiDateGridCode =
    `gridOptions: DataGridOptions = {\n  thaiDate: true,\n  columns: [\n    { dataField: 'admitdate', dataType: 'date', format: 'medium' },\n  ]\n}`;

  sections: Section[] = [
    { id: 'install',   label: '📦 ติดตั้ง' },
    { id: 'quickstart',label: '🚀 Quick Start' },
    { id: 'components',label: '🧩 Components' },
    { id: 'datagrid',  label: '📊 DataGrid Options' },
    { id: 'editing',   label: '✏️ Editing Modes' },
    { id: 'events',    label: '⚡ Events' },
    { id: 'export',    label: '📤 Export Excel' },
    { id: 'inputs',    label: '🔤 Input Components' },
    { id: 'thaidate',  label: '📅 Thai Date' },
    { id: 'migration', label: '🔄 Migration จาก DevExtreme' },
    { id: 'examples',  label: '💡 ตัวอย่างโปรเจค' },
  ];

  scrollTo(id: string): void {
    this.activeSection = id;
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
