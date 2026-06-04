import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatagridModule, DataGridOptions, ThaiDatePipe } from '@darkoum/ng-datagrid';

interface StudentForm {
  // ข้อมูลการศึกษา
  admitdate:         Date | null;
  finishdate:        Date | null;
  // ข้อมูลส่วนบุคคล
  birthdate:         Date | null;
  // หนังสือเดินทาง
  passportstartdate: Date | null;
  passportenddate:   Date | null;
  visastartdate:     Date | null;
  visaexpire:        Date | null;
  // ความพิการ
  deformcard_startdate: Date | null;
  deformcard_enddate:   Date | null;
  // วุฒิเดิม
  entrygraduatedate: Date | null;
}

interface SampleEvent {
  id: number;
  name: string;
  startDate: Date;
  endDate: Date;
  type: string;
  note: string;
}

@Component({
  selector: 'app-date-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, DatagridModule, ThaiDatePipe],
  templateUrl: './date-demo.component.html',
  styleUrl: './date-demo.component.scss',
})
export class DateDemoComponent {
  // ─── Tab ──────────────────────────────────────────────────────────────
  activeTab = signal<'education' | 'personal' | 'document'>('education');

  // ─── Student Form (เหมือน v17 popup) ─────────────────────────────────
  form: StudentForm = {
    admitdate:            new Date('2021-06-01'),
    finishdate:           null,
    birthdate:            new Date('2002-05-15'),
    passportstartdate:    null,
    passportenddate:      null,
    visastartdate:        null,
    visaexpire:           null,
    deformcard_startdate: null,
    deformcard_enddate:   null,
    entrygraduatedate:    new Date('2021-03-20'),
  };

  saved = signal(false);
  savedForm: StudentForm | null = null;
  today = new Date();

  readonly pipe = new ThaiDatePipe();

  saveForm() {
    this.savedForm = { ...this.form };
    this.saved.set(true);
    setTimeout(() => this.saved.set(false), 3000);
  }

  fmt(d: Date | null, f: string = 'medium'): string {
    return d ? this.pipe.transform(d, f as any) : '—';
  }

  calcAge(birth: Date | null): number {
    if (!birth) return 0;
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  }

  isExpired(d: Date | null): boolean {
    return !!d && d < new Date();
  }

  // ─── Format table (section 2) ─────────────────────────────────────────
  selectedDate = signal<Date | null>(new Date());

  formats = [
    { label: 'short',          desc: 'วัน เดือนย่อ ปีสั้น (68)' },
    { label: 'mediumDate',     desc: 'วัน เดือนย่อ ปีเต็ม (2568)' },
    { label: 'medium',         desc: 'วัน เดือนเต็ม ปีเต็ม' },
    { label: 'long',           desc: 'วันในสัปดาห์ + วัน เดือน พ.ศ.' },
    { label: 'shortDate',      desc: 'วว/ดด/ปปปป' },
    { label: 'shortDateTime',  desc: 'วัน เดือนย่อ ปีสั้น HH:mm' },
    { label: 'mediumDateTime', desc: 'วัน เดือนเต็ม ปีเต็ม HH:mm:ss' },
    { label: 'timeOnly',       desc: 'HH:mm:ss' },
  ] as const;

  getFormatted(fmt: any): string {
    return this.pipe.transform(this.selectedDate(), fmt as any);
  }

  // ─── DataGrid ─────────────────────────────────────────────────────────
  events: SampleEvent[] = [
    { id: 1, name: 'ปฐมนิเทศนักศึกษา',   startDate: new Date('2024-06-01'), endDate: new Date('2024-06-02'), type: 'กิจกรรม',    note: 'อาคาร A ห้อง 101' },
    { id: 2, name: 'สอบกลางภาค',          startDate: new Date('2024-07-15'), endDate: new Date('2024-07-19'), type: 'สอบ',        note: 'ตามตาราง' },
    { id: 3, name: 'วันพ่อแห่งชาติ',       startDate: new Date('2024-12-05'), endDate: new Date('2024-12-05'), type: 'วันหยุด',   note: 'วันหยุดราชการ' },
    { id: 4, name: 'สอบปลายภาค',          startDate: new Date('2025-01-10'), endDate: new Date('2025-01-17'), type: 'สอบ',        note: 'ตามตาราง' },
    { id: 5, name: 'รับปริญญา 2567',       startDate: new Date('2025-03-20'), endDate: new Date('2025-03-21'), type: 'พิธีการ',   note: 'หอประชุมใหญ่' },
    { id: 6, name: 'เปิดภาคเรียน 1/2568', startDate: new Date('2025-06-02'), endDate: new Date('2025-06-02'), type: 'การศึกษา', note: 'ภาคเรียนที่ 1' },
    { id: 7, name: 'สงกรานต์',             startDate: new Date('2025-04-13'), endDate: new Date('2025-04-15'), type: 'วันหยุด',   note: 'วันหยุดราชการ' },
  ];

  gridOptions: DataGridOptions<SampleEvent> = {
    keyExpr: 'id',
    dataSource: { store: this.events },
    columns: [
      { dataField: 'name',      caption: 'ชื่อกิจกรรม', width: 200 },
      { dataField: 'type',      caption: 'ประเภท', width: 100, alignment: 'center' },
      { dataField: 'startDate', caption: 'วันที่เริ่ม',  dataType: 'date', format: 'medium', width: 180 },
      { dataField: 'endDate',   caption: 'วันที่สิ้นสุด', dataType: 'date', format: 'medium', width: 180 },
      { dataField: 'note',      caption: 'หมายเหตุ' },
    ],
    paging: { enabled: false },
    showBorders: true,
    rowAlternationEnabled: true,
    hoverStateEnabled: true,
    sorting: { mode: 'single' },
    thaiDate: true,
    thaiDateFormat: 'medium',
  };
}
