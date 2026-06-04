import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatagridModule, DataGridOptions } from '@darkoum/ng-datagrid';
import { MockDataService } from '../../core/mock-data.service';

@Component({
  selector: 'app-student-set',
  standalone: true,
  imports: [CommonModule, FormsModule, DatagridModule],
  templateUrl: './student-set.component.html',
  styleUrl: './student-set.component.scss',
})
export class StudentSetComponent implements OnInit {

  // ─── Search filters ──────────────────────────────────────────────────
  camid:           number | null = null;
  lvlid:           number | null = null;
  facid:           number | null = null;
  degid:           number | null = null;
  admitacadyear:   number = 2567;
  admitsemester:   number = 1;
  studentgroupabb: string = '';

  // ─── Copy Popup ──────────────────────────────────────────────────────
  popupCopyVisible = signal(false);
  campusidcopy:   number | null = null;
  levelidcopy:    number | null = null;
  facultyidcopy:  number | null = null;
  admitaccopy:    number = 2568;
  admitsemcopy:   number = 1;

  // ─── Batch Update Popup ──────────────────────────────────────────────
  popupBatchVisible = signal(false);
  batchAcadid:          number | null = null;
  batchFeegroupid:      number | null = null;
  batchSchedulegroupid: number | null = null;
  batchStatus:          number | null = null;

  // ─── DataGrid: กลุ่มนักศึกษา ─────────────────────────────────────────
  studentSetGridOptions!: DataGridOptions;

  // ─── DataGrid: รายชื่อนักศึกษา ───────────────────────────────────────
  studentListGridOptions!: DataGridOptions;
  selectedSetName = signal('');

  constructor(public mock: MockDataService) {}

  ngOnInit(): void {
    this.buildSetGrid(this.mock.studentSetList);
    this.buildStudentGrid([]);
  }

  // ── build DataGrid กลุ่มนักศึกษา ──────────────────────────────────────
  buildSetGrid(data: any[]) {
    const { campusCombo, programCombo, studyPeriodCombo, setStatusCombo,
            acadCombo, scheduleCombo, feeGroupCombo, officerCombo } = this.mock;

    this.studentSetGridOptions = {
      keyExpr: 'setid',
      dataSource: { store: data },
      columns: [
        { dataField: 'groupyear',        caption: 'รุ่น',              width: 60,  alignment: 'center' },
        { dataField: 'campusid',         caption: 'ศูนย์/วิทยาเขต',   width: 160, lookup: { dataSource: campusCombo,      valueExpr: 'comboid', displayExpr: 'comboshow' } },
        { dataField: 'programshow',      caption: 'สาขาวิชา',          width: 200 },
        { dataField: 'startstudentcode', caption: 'รหัสนักศึกษาเริ่มต้น', width: 160 },
        { dataField: 'studyperiod',      caption: 'รอบ',               width: 120, lookup: { dataSource: studyPeriodCombo, valueExpr: 'comboid', displayExpr: 'comboshow' } },
        { dataField: 'groupcode',        caption: 'ห้อง',              width: 70,  alignment: 'center' },
        { dataField: 'studentgroupabb',  caption: 'ชื่อกลุ่ม',         width: 120 },
        { dataField: 'plantotalseat',    caption: 'แผนรับ',            width: 70,  alignment: 'right' },
        { dataField: 'totalnum',         caption: 'จำนวนรับ',          width: 80,  alignment: 'right' },
        { dataField: 'studentnum',       caption: 'ปัจจุบัน',          width: 75,  alignment: 'right' },
        { dataField: 'currentnum',       caption: 'นศ.ปกติ',           width: 75,  alignment: 'right' },
        { dataField: 'graduatnum',       caption: 'นศ.สำเร็จ',         width: 80,  alignment: 'right' },
        { dataField: 'retirenum',        caption: 'พ้นสภาพ',           width: 80,  alignment: 'right' },
        { dataField: 'admitacadyear',    caption: 'ปีที่เข้า',          width: 80,  alignment: 'center' },
        { dataField: 'admitsemester',    caption: 'ภาคที่',             width: 65,  alignment: 'center' },
        { dataField: 'feegroupid',       caption: 'บัญชีค่าใช้จ่าย',   width: 130, lookup: { dataSource: feeGroupCombo,  valueExpr: 'comboid', displayExpr: 'comboshow' } },
        { dataField: 'acadid',           caption: 'การประเมินผล',      width: 140, lookup: { dataSource: acadCombo,       valueExpr: 'comboid', displayExpr: 'comboshow' } },
        { dataField: 'schedulegroupid',  caption: 'ปฏิทินการศึกษา',   width: 130, lookup: { dataSource: scheduleCombo,   valueExpr: 'comboid', displayExpr: 'comboshow' } },
        { dataField: 'admitdate',        caption: 'วันที่เข้า',         width: 160, dataType: 'date', format: 'medium' },
        { dataField: 'officerid',        caption: 'ที่ปรึกษา 1',       width: 160, lookup: { dataSource: officerCombo,   valueExpr: 'comboid', displayExpr: 'comboshow' } },
        { dataField: 'officerid2',       caption: 'ที่ปรึกษา 2',       width: 160, lookup: { dataSource: officerCombo,   valueExpr: 'comboid', displayExpr: 'comboshow' } },
        { dataField: 'studentsetstatus', caption: 'สถานะ',             width: 130, lookup: { dataSource: setStatusCombo, valueExpr: 'comboid', displayExpr: 'comboshow' } },
      ],
      paging:  { enabled: true, pageSize: 10 },
      pager:   { showPageSizeSelector: true, allowedPageSizes: [10, 15, 20], showInfo: true },
      sorting: { mode: 'multiple' },
      showBorders: true,
      rowAlternationEnabled: true,
      hoverStateEnabled: true,
      allowColumnResizing: true,
      selection: { mode: 'single' },
      thaiDate: true,
      editing: {
        mode: 'popup',
        allowUpdating: true,
        allowAdding: true,
        allowDeleting: true,
        confirmDelete: true,
        popup: { title: 'บันทึกรุ่นกลุ่มนักศึกษา', width: 900, height: 620, showTitle: true },
        form: {
          colCount: 2,
          items: [
            { itemType: 'group', caption: '🏫 ศูนย์/วิทยาเขต', colCount: 2, items: [
              { dataField: 'campusid',  label: { text: 'ศูนย์/วิทยาเขต' }, colSpan: 2,
                editorType: 'dxSelectBox', editorOptions: { dataSource: campusCombo, valueExpr: 'comboid', displayExpr: 'comboshow', searchEnabled: true } },
            ]},
            { itemType: 'group', caption: '📋 ข้อมูลกลุ่ม', colCount: 2, items: [
              { dataField: 'groupyear',       label: { text: 'รุ่น' } },
              { dataField: 'groupseq',        label: { text: 'ลำดับแผน' } },
              { dataField: 'groupcode',       label: { text: 'ห้อง' } },
              { dataField: 'studentgroupabb', label: { text: 'ชื่อกลุ่มนักศึกษา' }, colSpan: 2 },
              { dataField: 'studyperiod',     label: { text: 'รอบ' },
                editorType: 'dxSelectBox', editorOptions: { dataSource: studyPeriodCombo, valueExpr: 'comboid', displayExpr: 'comboshow' } },
            ]},
            { itemType: 'group', caption: '🔢 จำนวน', colCount: 2, items: [
              { dataField: 'plantotalseat', label: { text: 'จำนวนแผนรับ' } },
              { dataField: 'totalnum',      label: { text: 'จำนวนรับ' } },
              { dataField: 'studentnum',    label: { text: 'ปัจจุบัน' },  editorOptions: { readOnly: true } },
              { dataField: 'currentnum',    label: { text: 'นศ.ปกติ' },   editorOptions: { readOnly: true } },
              { dataField: 'graduatnum',    label: { text: 'นศ.สำเร็จ' }, editorOptions: { readOnly: true } },
              { dataField: 'retirenum',     label: { text: 'พ้นสภาพ' },   editorOptions: { readOnly: true } },
            ]},
            { itemType: 'group', caption: '🎓 หลักสูตร', colCount: 1, items: [
              { dataField: 'programshow',       label: { text: 'สาขาวิชา' } },
              { dataField: 'graduateprogramid', label: { text: 'หลักสูตรตรวจจบ' },
                editorType: 'dxSelectBox', editorOptions: { dataSource: programCombo, valueExpr: 'comboid', displayExpr: 'comboshow', searchEnabled: true } },
            ]},
            { itemType: 'group', caption: '📅 วันที่ / ปีการศึกษา', colCount: 2, items: [
              { dataField: 'admitacadyear', label: { text: 'ปีที่เข้า' },   editorOptions: { readOnly: true } },
              { dataField: 'admitsemester', label: { text: 'ภาคที่' },       editorOptions: { readOnly: true } },
              { dataField: 'admitdate',     label: { text: 'วันที่เข้า' },   editorType: 'dxDateBox', colSpan: 2 },
              { dataField: 'startstudentcode', label: { text: 'รหัสนักศึกษาเริ่มต้น' }, colSpan: 2 },
            ]},
            { itemType: 'group', caption: '⚙️ การตั้งค่า', colCount: 2, items: [
              { dataField: 'acadid',          label: { text: 'การประเมินผล' },
                editorType: 'dxSelectBox', editorOptions: { dataSource: acadCombo, valueExpr: 'comboid', displayExpr: 'comboshow' } },
              { dataField: 'schedulegroupid', label: { text: 'ปฏิทินการศึกษา' },
                editorType: 'dxSelectBox', editorOptions: { dataSource: scheduleCombo, valueExpr: 'comboid', displayExpr: 'comboshow' } },
              { dataField: 'feegroupid',      label: { text: 'บัญชีค่าใช้จ่าย' },
                editorType: 'dxSelectBox', editorOptions: { dataSource: feeGroupCombo, valueExpr: 'comboid', displayExpr: 'comboshow' } },
              { dataField: 'studentsetstatus', label: { text: 'สถานะกลุ่มนักศึกษา' },
                editorType: 'dxSelectBox', editorOptions: { dataSource: setStatusCombo, valueExpr: 'comboid', displayExpr: 'comboshow' } },
            ]},
            { itemType: 'group', caption: '👨‍🏫 อาจารย์ที่ปรึกษา', colCount: 2, items: [
              { dataField: 'officerid',  label: { text: 'ที่ปรึกษา 1' },
                editorType: 'dxSelectBox', editorOptions: { dataSource: officerCombo, valueExpr: 'comboid', displayExpr: 'comboshow', showClearButton: true } },
              { dataField: 'officerid2', label: { text: 'ที่ปรึกษา 2' },
                editorType: 'dxSelectBox', editorOptions: { dataSource: officerCombo, valueExpr: 'comboid', displayExpr: 'comboshow', showClearButton: true } },
              { dataField: 'officerid3', label: { text: 'ที่ปรึกษา 3' },
                editorType: 'dxSelectBox', editorOptions: { dataSource: officerCombo, valueExpr: 'comboid', displayExpr: 'comboshow', showClearButton: true } },
              { dataField: 'officerid4', label: { text: 'ที่ปรึกษา 4' },
                editorType: 'dxSelectBox', editorOptions: { dataSource: officerCombo, valueExpr: 'comboid', displayExpr: 'comboshow', showClearButton: true } },
              { dataField: 'officerid5', label: { text: 'ที่ปรึกษา 5' }, colSpan: 2,
                editorType: 'dxSelectBox', editorOptions: { dataSource: officerCombo, valueExpr: 'comboid', displayExpr: 'comboshow', showClearButton: true } },
            ]},
          ],
        },
      },
      export: { enabled: true, formats: ['xlsx'], fileName: 'student-set' },
    };
  }

  // ── build DataGrid รายชื่อนักศึกษา ─────────────────────────────────────
  buildStudentGrid(data: any[]) {
    this.studentListGridOptions = {
      keyExpr: 'studentcode',
      dataSource: { store: data },
      columns: [
        { dataField: 'studentcode',      caption: 'รหัสนักศึกษา', width: 140 },
        { dataField: 'prefixname',       caption: 'คำนำหน้า',     width: 100 },
        { dataField: 'studentname',      caption: 'ชื่อ-นามสกุล' },
        { dataField: 'studentstatusshow',caption: 'สถานภาพ',      width: 130 },
      ],
      paging:  { enabled: true, pageSize: 5 },
      pager:   { showPageSizeSelector: true, allowedPageSizes: [5, 10, 15], showInfo: true },
      showBorders: true,
      rowAlternationEnabled: true,
      hoverStateEnabled: true,
    };
  }

  // ─── Row click → load student list ──────────────────────────────────
  onRowClick(row: any) {
    if (!row) return;
    const setid = row.setid;
    const name  = row.studentgroupabb ?? '';
    this.selectedSetName.set(name);
    const students = this.mock.studentsBySet[setid] ?? [];
    this.buildStudentGrid(students);
  }

  // ─── Search ──────────────────────────────────────────────────────────
  search() {
    let result = this.mock.studentSetList;
    if (this.camid)           result = result.filter(s => s.campusid === this.camid);
    if (this.lvlid)           result = result.filter(s => s.levelid  === this.lvlid);
    if (this.facid)           result = result.filter(s => s.facultyid === this.facid);
    if (this.admitacadyear)   result = result.filter(s => s.admitacadyear === this.admitacadyear);
    if (this.admitsemester)   result = result.filter(s => s.admitsemester === this.admitsemester);
    if (this.studentgroupabb.trim()) {
      const q = this.studentgroupabb.trim().toLowerCase();
      result = result.filter(s => s.studentgroupabb?.toLowerCase().includes(q));
    }
    this.buildSetGrid(result);
    this.selectedSetName.set('');
    this.buildStudentGrid([]);
  }

  clearSearch() {
    this.camid = null; this.lvlid = null; this.facid = null; this.degid = null;
    this.admitacadyear = 2567; this.admitsemester = 1; this.studentgroupabb = '';
    this.buildSetGrid(this.mock.studentSetList);
    this.selectedSetName.set('');
    this.buildStudentGrid([]);
  }

  // ─── Popup: คัดลอก ────────────────────────────────────────────────────
  showCopy()  { this.popupCopyVisible.set(true); }
  onCopy() {
    alert(`คัดลอกกลุ่มนักศึกษา → ปี ${this.admitaccopy} ภาค ${this.admitsemcopy}`);
    this.popupCopyVisible.set(false);
  }

  // ─── Popup: ปรับข้อมูลเป็นชุด ─────────────────────────────────────────
  showBatch() { this.popupBatchVisible.set(true); }
  onBatch() {
    alert('ปรับข้อมูลกลุ่มนักศึกษาเป็นชุดเรียบร้อย');
    this.popupBatchVisible.set(false);
  }
}
