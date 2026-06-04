import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  DatagridComponent, DataGridOptions,
  TextBoxComponent, ButtonComponent,
} from '@darkoum/ng-datagrid';
import { MockDataService, Student } from '../../core/mock-data.service';

@Component({
  selector: 'app-grade-result',
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe, DatagridComponent, TextBoxComponent, ButtonComponent],
  templateUrl: './grade-result.component.html',
  styleUrl: './grade-result.component.scss',
})
export class GradeResultComponent {
  readonly mock = inject(MockDataService);

  searchCode = '';
  student    = signal<Student | null>(null);
  notFound   = signal(false);
  terms      = signal<{ acadyear: number; semester: number; label: string }[]>([]);
  activeTermIdx = signal(0);

  gridOptions = signal<DataGridOptions<any> | null>(null);

  summary = computed(() => {
    const s = this.student();
    if (!s) return null;
    return this.mock.getGradeSummary(s.studentid);
  });

  activeTerm = computed(() => this.terms()[this.activeTermIdx()] ?? null);

  termRows = computed(() => {
    const s = this.student();
    const t = this.activeTerm();
    if (!s || !t) return [];
    return this.mock.getGradeByTerm(s.studentid, t.acadyear, t.semester);
  });

  termGPA = computed(() => {
    const rows = this.termRows().filter(r => r.gradepoint !== null && r.gradepoint !== undefined);
    if (!rows.length) return null;
    const totalCP = rows.reduce((s: number, r: any) => s + r.creditpoint, 0);
    const totalC  = rows.reduce((s: number, r: any) => s + r.credit, 0);
    return totalC > 0 ? Math.round(totalCP / totalC * 100) / 100 : 0;
  });

  termCreditAttempt  = computed(() => this.termRows().reduce((s: number, r: any) => s + r.credit, 0));
  termCreditSatisfy  = computed(() => this.termRows().filter((r: any) => r.gradepoint !== null && r.gradepoint !== undefined).reduce((s: number, r: any) => s + r.credit, 0));
  termCreditPoint    = computed(() => this.termRows().filter((r: any) => r.gradepoint !== null && r.gradepoint !== undefined).reduce((s: number, r: any) => s + r.creditpoint, 0));

  search(): void {
    const code = this.searchCode.trim();
    if (!code) return;
    const found = this.mock.students.find(s => s.studentcode === code);
    this.student.set(found ?? null);
    this.notFound.set(!found);
    if (found) {
      const terms = this.mock.getTerms(found.studentid);
      this.terms.set(terms);
      this.activeTermIdx.set(terms.length - 1);
      this.buildGrid(found.studentid, terms[terms.length - 1]);
    } else {
      this.terms.set([]); this.gridOptions.set(null);
    }
  }

  selectTerm(idx: number): void {
    this.activeTermIdx.set(idx);
    const t = this.terms()[idx];
    if (this.student() && t) this.buildGrid(this.student()!.studentid, t);
  }

  private buildGrid(studentid: number, term: { acadyear: number; semester: number }): void {
    const rows = this.mock.getGradeByTerm(studentid, term.acadyear, term.semester);
    this.gridOptions.set({
      keyExpr: 'coursecode',
      dataSource: { store: rows },
      columns: [
        { dataField: 'coursecode',  caption: 'รหัสวิชา',   width: 110 },
        { dataField: 'coursename',  caption: 'ชื่อวิชา' },
        { dataField: 'credit',      caption: 'หน่วยกิต',  width: 80, alignment: 'center' },
        { dataField: 'grade',       caption: 'เกรด',       width: 65, alignment: 'center' },
        { dataField: 'gradepoint',  caption: 'คะแนน',      width: 75, alignment: 'center', format: '0.0' },
        { dataField: 'creditpoint', caption: 'คะแนน×หน่วยกิต', width: 120, alignment: 'right', format: '0.0' },
      ],
      showBorders: true,
      rowAlternationEnabled: true,
      hoverStateEnabled: true,
      paging: { enabled: false },
    });
  }

  getPrefixLabel(s: Student): string { return this.mock.prefixCombo.find(c => c.comboid === s.prefixid)?.comboshow ?? ''; }
  getFacultyLabel(s: Student): string { return this.mock.facultyCombo.find(c => c.comboid === s.facultyid)?.comboshow ?? ''; }
  getProgramLabel(s: Student): string { return this.mock.programCombo.find(c => c.comboid === s.programid)?.comboshow ?? ''; }
  getStatusLabel(s: Student): string { return this.mock.statusCombo.find(c => c.comboid === s.studentstatus)?.comboshow ?? ''; }
}
