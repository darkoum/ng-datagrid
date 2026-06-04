import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  DatagridComponent, DataGridOptions,
  TextBoxComponent, ButtonComponent,
} from '@darkoum/ng-datagrid';
import { MockDataService, Student } from '../../core/mock-data.service';

type TabKey = 'enroll' | 'schedule' | 'exam' | 'fee';

@Component({
  selector: 'app-student-allinfo',
  standalone: true,
  imports: [CommonModule, FormsModule, DatagridComponent, TextBoxComponent, ButtonComponent],
  templateUrl: './student-allinfo.component.html',
  styleUrl:    './student-allinfo.component.scss',
})
export class StudentAllinfoComponent {
  readonly mock = inject(MockDataService);

  searchCode = '';
  student    = signal<Student | null>(null);
  notFound   = signal(false);
  activeTab  = signal<TabKey>('enroll');

  selectedSemester = signal<{ acadyear: number; semester: number } | null>(null);

  statusGridOptions  = signal<DataGridOptions<any> | null>(null);
  enrollGridOptions  = signal<DataGridOptions<any> | null>(null);
  scheduleGridOptions= signal<DataGridOptions<any> | null>(null);
  examGridOptions    = signal<DataGridOptions<any> | null>(null);
  feeGridOptions     = signal<DataGridOptions<any> | null>(null);

  readonly tabs: { key: TabKey; label: string }[] = [
    { key: 'enroll',   label: '📋 ผลลงทะเบียน' },
    { key: 'schedule', label: '🕐 ตารางเรียน' },
    { key: 'exam',     label: '📝 ตารางสอบ' },
    { key: 'fee',      label: '💰 หนี้สิน' },
  ];

  search(): void {
    const code = this.searchCode.trim();
    if (!code) return;
    const found = this.mock.students.find(s => s.studentcode === code);
    this.student.set(found ?? null);
    this.notFound.set(!found);
    if (found) {
      this.buildStatusGrid(found.studentid);
      this.buildDetailGrids(found.studentid, 2566, 2);
    } else {
      this.statusGridOptions.set(null);
      this.clearDetailGrids();
    }
  }

  private buildStatusGrid(studentid: number): void {
    const history = this.mock.studentStatusHistory[studentid] ?? [];
    this.statusGridOptions.set({
      keyExpr: 'id',
      dataSource: { store: history },
      columns: [
        { dataField: 'acadyear', caption: 'ปี', width: 70 },
        { dataField: 'semester', caption: 'ภาค', width: 45, alignment: 'center' },
        { dataField: 'studentstatusshow', caption: 'สถานภาพ' },
        { dataField: 'gpax', caption: 'GPAX', width: 60, format: '0.00', alignment: 'right' },
        { dataField: 'gpa',  caption: 'GPA',  width: 55, format: '0.00', alignment: 'right' },
        { dataField: 'sumcreditsatisfy', caption: 'CSX', width: 45, alignment: 'right' },
      ],
      showBorders: true,
      rowAlternationEnabled: true,
      hoverStateEnabled: true,
      paging: { enabled: false },
      onRowClick: (e: any) => {
        this.selectedSemester.set({ acadyear: e.data.acadyear, semester: e.data.semester });
        this.buildDetailGrids(this.student()!.studentid, e.data.acadyear, e.data.semester);
      },
    });
  }

  private buildDetailGrids(studentid: number, acadyear: number, semester: number): void {
    const key = `${studentid}_${acadyear}_${semester}`;
    const enroll   = this.mock.enrollResults[key]   ?? this.makeDemoEnroll();
    const schedule = this.mock.classSchedule[key]   ?? this.makeDemoSchedule();
    const exam     = this.mock.examSchedule[key]    ?? this.makeDemoExam();

    this.enrollGridOptions.set({
      keyExpr: 'coursecode',
      dataSource: { store: enroll },
      columns: [
        { dataField: 'coursecode', caption: 'รหัสวิชา', width: 110 },
        { dataField: 'coursename', caption: 'ชื่อวิชา' },
        { dataField: 'sectioncode', caption: 'กลุ่ม', width: 60, alignment: 'center' },
        { dataField: 'creditattempt', caption: 'หน่วยกิต', width: 80, alignment: 'center' },
        { dataField: 'grade', caption: 'เกรด', width: 65, alignment: 'center' },
      ],
      showBorders: true, rowAlternationEnabled: true, hoverStateEnabled: true,
      paging: { enabled: false },
    });

    this.scheduleGridOptions.set({
      keyExpr: 'coursecode',
      dataSource: { store: schedule },
      columns: [
        { dataField: 'weekday',      caption: 'วัน', width: 60 },
        { dataField: 'timeshowfrom', caption: 'จาก', width: 75 },
        { dataField: 'timeshowto',   caption: 'ถึง',  width: 75 },
        { dataField: 'coursecode',   caption: 'รหัสวิชา', width: 110 },
        { dataField: 'roomcode',     caption: 'ห้อง' },
      ],
      showBorders: true, rowAlternationEnabled: true, hoverStateEnabled: true,
      paging: { enabled: false },
      sorting: { mode: 'single' },
    });

    this.examGridOptions.set({
      keyExpr: 'coursecode',
      dataSource: { store: exam },
      columns: [
        { dataField: 'examcode',     caption: 'ประเภท', width: 70 },
        { dataField: 'examdate',     caption: 'วันที่สอบ', width: 110 },
        { dataField: 'examtimefrom', caption: 'จาก', width: 70 },
        { dataField: 'examtimeto',   caption: 'ถึง',  width: 70 },
        { dataField: 'coursecode',   caption: 'รหัสวิชา', width: 110 },
        { dataField: 'roomcode',     caption: 'ห้อง' },
      ],
      showBorders: true, rowAlternationEnabled: true, hoverStateEnabled: true,
      paging: { enabled: false },
    });

    this.feeGridOptions.set({
      keyExpr: 'feeid',
      dataSource: { store: this.makeDemoFee() },
      columns: [
        { dataField: 'feeid',     caption: 'รหัส คชจ', width: 100 },
        { dataField: 'feeidname', caption: 'ค่าธรรมเนียม' },
        { dataField: 'amount',    caption: 'จำนวนเงิน', width: 120, format: '#,##0.00', alignment: 'right' },
        { dataField: 'paid',      caption: 'ชำระแล้ว',  width: 120, format: '#,##0.00', alignment: 'right' },
        { dataField: 'balance',   caption: 'คงเหลือ',    width: 120, format: '#,##0.00', alignment: 'right' },
      ],
      showBorders: true, rowAlternationEnabled: true, hoverStateEnabled: true,
      paging: { enabled: false },
    });
  }

  private clearDetailGrids(): void {
    this.enrollGridOptions.set(null); this.scheduleGridOptions.set(null);
    this.examGridOptions.set(null);   this.feeGridOptions.set(null);
  }

  private makeDemoEnroll(): any[] {
    return [
      { coursecode:'01076313', coursename:'วิศวกรรมซอฟต์แวร์', sectioncode:'1', grade:'A',  creditattempt:3 },
      { coursecode:'01076314', coursename:'ฐานข้อมูล',          sectioncode:'1', grade:'B+', creditattempt:3 },
      { coursecode:'01076315', coursename:'เครือข่ายคอมพิวเตอร์', sectioncode:'2', grade:'A', creditattempt:3 },
    ];
  }
  private makeDemoSchedule(): any[] {
    return [
      { weekday:'จ', timeshowfrom:'08:00', timeshowto:'11:00', coursecode:'01076313', roomcode:'ENG-301' },
      { weekday:'อ', timeshowfrom:'09:00', timeshowto:'12:00', coursecode:'01076314', roomcode:'SCI-201' },
      { weekday:'พ', timeshowfrom:'13:00', timeshowto:'16:00', coursecode:'01076315', roomcode:'ENG-201' },
    ];
  }
  private makeDemoExam(): any[] {
    return [
      { examcode:'MID', examdate:'2566-10-20', examtimefrom:'09:00', examtimeto:'12:00', coursecode:'01076313', roomcode:'ENG-301' },
      { examcode:'FIN', examdate:'2566-12-15', examtimefrom:'09:00', examtimeto:'12:00', coursecode:'01076313', roomcode:'ENG-301' },
    ];
  }
  private makeDemoFee(): any[] {
    return [
      { feeid:'F001', feeidname:'ค่าเล่าเรียน',        amount:35000, paid:35000, balance:0 },
      { feeid:'F002', feeidname:'ค่าบำรุงสถาบัน',      amount:5000,  paid:5000,  balance:0 },
      { feeid:'F003', feeidname:'ค่าประกันอุบัติเหตุ', amount:500,   paid:500,   balance:0 },
    ];
  }

  getStatusLabel(s: Student): string { return this.mock.statusCombo.find(c=>c.comboid===s.studentstatus)?.comboshow ?? ''; }
  getFacultyLabel(s: Student): string { return this.mock.facultyCombo.find(c=>c.comboid===s.facultyid)?.comboshow ?? ''; }
  getProgramLabel(s: Student): string { return this.mock.programCombo.find(c=>c.comboid===s.programid)?.comboshow ?? ''; }
  getPrefixLabel(s: Student): string { return this.mock.prefixCombo.find(c=>c.comboid===s.prefixid)?.comboshow ?? ''; }
  getCampusLabel(s: Student): string { return this.mock.campusCombo.find(c=>c.comboid===s.campusid)?.comboshow ?? ''; }

  setTab(key: TabKey): void { this.activeTab.set(key); }
}
