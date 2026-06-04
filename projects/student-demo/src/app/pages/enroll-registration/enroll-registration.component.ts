import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  DatagridComponent, DataGridOptions,
  TextBoxComponent, ButtonComponent, SelectBoxComponent,
} from '@darkoum/ng-datagrid';
import { MockDataService, Student } from '../../core/mock-data.service';

@Component({
  selector: 'app-enroll-registration',
  standalone: true,
  imports: [CommonModule, FormsModule, DatagridComponent, TextBoxComponent, ButtonComponent, SelectBoxComponent],
  templateUrl: './enroll-registration.component.html',
  styleUrl: './enroll-registration.component.scss',
})
export class EnrollRegistrationComponent {
  readonly mock = inject(MockDataService);

  searchCode = '';
  selectedAcadyear = 2567;
  selectedSemester = 1;

  student    = signal<Student | null>(null);
  notFound   = signal(false);
  registered = signal<any[]>([]);

  openGridOptions  = signal<DataGridOptions<any> | null>(null);
  regGridOptions   = signal<DataGridOptions<any> | null>(null);

  totalCredits = computed(() => this.registered().reduce((s, r) => s + (r.credit ?? 0), 0));
  maxCredits   = 22;

  search(): void {
    const code = this.searchCode.trim();
    if (!code) return;
    const found = this.mock.students.find(s => s.studentcode === code);
    this.student.set(found ?? null);
    this.notFound.set(!found);
    if (found) this.buildGrids(found.studentid);
    else { this.openGridOptions.set(null); this.regGridOptions.set(null); this.registered.set([]); }
  }

  private buildGrids(studentid: number): void {
    // initial load only — set registered from mock then refresh grids
    const key = `${studentid}_${this.selectedAcadyear}_${this.selectedSemester}`;
    const regs = (this.mock.registrations[key] ?? []).map(r => ({ ...r }));
    this.registered.set(regs);
    this.refreshGrids();
  }

  private refreshGrids(): void {
    const registeredIds = new Set(this.registered().map((r: any) => r.courseid));
    const available = this.mock.openCourses.filter(c => !registeredIds.has(c.courseid));

    this.openGridOptions.set({
      keyExpr: 'courseid',
      dataSource: { store: available },
      columns: [
        { dataField: 'coursecode',  caption: 'รหัสวิชา',   width: 110 },
        { dataField: 'coursename',  caption: 'ชื่อวิชา' },
        { dataField: 'credit',      caption: 'หน่วยกิต',  width: 80, alignment: 'center' },
        { dataField: 'sectioncode', caption: 'กลุ่ม',      width: 55, alignment: 'center' },
        { dataField: 'weekday',     caption: 'วัน',         width: 50, alignment: 'center' },
        { dataField: 'timefrom',    caption: 'จาก',         width: 65 },
        { dataField: 'timeto',      caption: 'ถึง',          width: 65 },
        { dataField: 'instructor',  caption: 'ผู้สอน',      width: 160 },
        { dataField: 'enrolled',    caption: 'ลงแล้ว',     width: 70, alignment: 'center' },
        { dataField: 'seat',        caption: 'ที่นั่ง',     width: 65, alignment: 'center' },
      ],
      showBorders: true,
      rowAlternationEnabled: true,
      hoverStateEnabled: true,
      paging: { enabled: false },
      filterRow: { visible: true },
      onRowClick: (e: any) => this.addCourse(e.data),
    });

    this.regGridOptions.set({
      keyExpr: 'regid',
      dataSource: { store: this.registered() },
      columns: [
        { dataField: 'coursecode',  caption: 'รหัสวิชา',  width: 110 },
        { dataField: 'coursename',  caption: 'ชื่อวิชา' },
        { dataField: 'credit',      caption: 'หน่วยกิต', width: 75, alignment: 'center' },
        { dataField: 'sectioncode', caption: 'กลุ่ม',    width: 55, alignment: 'center' },
        { dataField: 'weekday',     caption: 'วัน',       width: 45, alignment: 'center' },
        { dataField: 'timefrom',    caption: 'จาก',       width: 70 },
        { dataField: 'timeto',      caption: 'ถึง',        width: 70 },
        { dataField: 'room',        caption: 'ห้อง',      width: 90 },
      ],
      showBorders: true,
      rowAlternationEnabled: true,
      hoverStateEnabled: true,
      paging: { enabled: false },
      editing: {
        mode: 'row',
        allowUpdating: false,
        allowAdding: false,
        allowDeleting: true,
      },
      onRowRemoved: (e: any) => {
        const remaining = this.registered().filter((r: any) => r.regid !== e.data.regid);
        this.registered.set(remaining);
        this.refreshGrids();
      },
    });
  }

  addCourse(course: any): void {
    const regs = this.registered();
    if (regs.some((r: any) => r.courseid === course.courseid)) return;
    if (this.totalCredits() + course.credit > this.maxCredits) {
      alert(`ไม่สามารถลงทะเบียนได้ เกินหน่วยกิตสูงสุด ${this.maxCredits} หน่วยกิต`);
      return;
    }
    this.registered.set([...regs, {
      regid: Date.now(),
      courseid: course.courseid,
      coursecode: course.coursecode,
      coursename: course.coursename,
      credit: course.credit,
      sectioncode: course.sectioncode,
      weekday: course.weekday,
      timefrom: course.timefrom,
      timeto: course.timeto,
      room: course.room,
      regtype: 1,
    }]);
    this.refreshGrids();
  }

  saveRegistration(): void {
    alert(`บันทึกลงทะเบียนสำเร็จ ${this.registered().length} วิชา รวม ${this.totalCredits()} หน่วยกิต`);
  }

  getPrefixLabel(s: Student): string { return this.mock.prefixCombo.find(c => c.comboid === s.prefixid)?.comboshow ?? ''; }
  getFacultyLabel(s: Student): string { return this.mock.facultyCombo.find(c => c.comboid === s.facultyid)?.comboshow ?? ''; }
  getProgramLabel(s: Student): string { return this.mock.programCombo.find(c => c.comboid === s.programid)?.comboshow ?? ''; }
  getStatusLabel(s: Student): string { return this.mock.statusCombo.find(c => c.comboid === s.studentstatus)?.comboshow ?? ''; }
}
