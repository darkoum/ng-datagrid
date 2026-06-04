import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  DatagridComponent, DataGridOptions,
  TextBoxComponent, ButtonComponent,
} from '@darkoum/ng-datagrid';
import { MockDataService, Student } from '../../core/mock-data.service';

@Component({
  selector: 'app-student-bioentry',
  standalone: true,
  imports: [CommonModule, FormsModule, DatagridComponent, TextBoxComponent, ButtonComponent],
  templateUrl: './student-bioentry.component.html',
  styleUrl:    './student-bioentry.component.scss',
})
export class StudentBioentryComponent {
  readonly mock = inject(MockDataService);

  searchCode = '';
  student    = signal<Student | null>(null);
  notFound   = signal(false);
  bioGridOptions = signal<DataGridOptions<any> | null>(null);

  search(): void {
    const code = this.searchCode.trim();
    if (!code) return;
    const found = this.mock.students.find(s => s.studentcode === code);
    this.student.set(found ?? null);
    this.notFound.set(!found);
    if (found) this.buildGrid(found.studentid);
    else this.bioGridOptions.set(null);
  }

  private buildGrid(studentid: number): void {
    const fields = this.mock.getBioFields(studentid);
    this.bioGridOptions.set({
      keyExpr: 'entryid',
      dataSource: { store: fields },
      columns: [
        { dataField: 'entryid',   caption: 'ลำดับ', width: 70, alignment: 'center', allowEditing: false },
        { dataField: 'entryname', caption: 'หัวข้อ', allowEditing: false },
        { dataField: 'invalue',   caption: 'ข้อมูล' },
      ],
      showBorders: true,
      rowAlternationEnabled: true,
      hoverStateEnabled: true,
      paging: { enabled: false },
      editing: {
        mode: 'row',
        allowUpdating: true,
        allowAdding: false,
        allowDeleting: false,
        useIcons: true,
        texts: { saveRowChanges: 'บันทึก', cancelRowChanges: 'ยกเลิก' },
      },
    });
  }

  getStatusLabel(s: Student): string {
    return this.mock.statusCombo.find(c => c.comboid === s.studentstatus)?.comboshow ?? '';
  }
  getFacultyLabel(s: Student): string {
    return this.mock.facultyCombo.find(c => c.comboid === s.facultyid)?.comboshow ?? '';
  }
  getProgramLabel(s: Student): string {
    return this.mock.programCombo.find(c => c.comboid === s.programid)?.comboshow ?? '';
  }
  getPrefixLabel(s: Student): string {
    return this.mock.prefixCombo.find(c => c.comboid === s.prefixid)?.comboshow ?? '';
  }
}
