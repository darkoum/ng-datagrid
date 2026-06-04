import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatagridModule, DataGridOptions } from '@darkoum/ng-datagrid';
import { MockDataService } from '../../core/mock-data.service';

@Component({
  selector: 'app-student-master',
  standalone: true,
  imports: [CommonModule, FormsModule, DatagridModule],
  templateUrl: './student-master.component.html',
  styleUrl: './student-master.component.scss',
})
export class StudentMasterComponent implements OnInit {
  studentcode = '';
  studentname = '';
  studentsurname = '';
  studentstatus: number | null = null;
  facultyid: number | null = null;

  gridOptions: DataGridOptions = {
    keyExpr: 'studentid',
    dataSource: { store: [] },
    columns: [],
    thaiDate: true,
  };

  constructor(public mock: MockDataService) {}

  ngOnInit() {
    this.buildGridOptions(this.mock.students);
  }

  buildGridOptions(data: any[]) {
    const { prefixCombo, statusCombo, facultyCombo, programCombo, campusCombo } = this.mock;
    this.gridOptions = {
      keyExpr: 'studentid',
      dataSource: { store: data },
      columns: [
        { dataField: 'studentcode',    caption: 'รหัสนักศึกษา', width: 130 },
        { dataField: 'prefixid',       caption: 'คำนำหน้า', width: 100,
          lookup: { dataSource: prefixCombo, valueExpr: 'comboid', displayExpr: 'comboshow' } },
        { dataField: 'studentname',    caption: 'ชื่อ' },
        { dataField: 'studentsurname', caption: 'นามสกุล' },
        { dataField: 'studentstatus',  caption: 'สถานภาพ', width: 140,
          lookup: { dataSource: statusCombo, valueExpr: 'comboid', displayExpr: 'comboshow' } },
        { dataField: 'studentyear',    caption: 'ชั้นปี', width: 70, alignment: 'center' },
        { dataField: 'gpa',            caption: 'GPA', width: 80, format: '#,##0.00', alignment: 'right' },
        { dataField: 'facultyid',      caption: 'คณะ', width: 220,
          lookup: { dataSource: facultyCombo, valueExpr: 'comboid', displayExpr: 'comboshow' } },
        { dataField: 'programid',      caption: 'สาขาวิชา',
          lookup: { dataSource: programCombo, valueExpr: 'comboid', displayExpr: 'comboshow' } },
        { dataField: 'admitdate',      caption: 'วันที่รับเข้า', dataType: 'date', format: 'medium', width: 170 },
      ],
      paging:  { enabled: true, pageSize: 15 },
      pager:   { showPageSizeSelector: true, allowedPageSizes: [15, 20, 25], showInfo: true },
      sorting: { mode: 'multiple' },
      showBorders: true,
      rowAlternationEnabled: true,
      hoverStateEnabled: true,
      filterRow: { visible: false },
      allowColumnResizing: true,
      editing: {
        mode: 'popup',
        allowUpdating: true,
        allowAdding: true,
        allowDeleting: true,
        confirmDelete: true,
        popup: { title: 'ข้อมูลนักศึกษา', width: 860, height: 560, showTitle: true },
        form: {
          colCount: 1,
          items: [
            { itemType: 'group', caption: '📋 ข้อมูลหลัก', colCount: 2, items: [
              { dataField: 'studentcode',    label: { text: 'รหัสนักศึกษา' }, isRequired: true },
              { dataField: 'prefixid',       label: { text: 'คำนำหน้า' }, editorType: 'dxSelectBox',
                editorOptions: { dataSource: prefixCombo, valueExpr: 'comboid', displayExpr: 'comboshow' } },
              { dataField: 'studentname',    label: { text: 'ชื่อ (ไทย)' },    isRequired: true },
              { dataField: 'studentsurname', label: { text: 'นามสกุล (ไทย)' }, isRequired: true },
            ]},
            { itemType: 'group', caption: '🎓 ข้อมูลการศึกษา', colCount: 2, items: [
              { dataField: 'studentstatus', label: { text: 'สถานภาพ' }, editorType: 'dxSelectBox',
                editorOptions: { dataSource: statusCombo, valueExpr: 'comboid', displayExpr: 'comboshow' } },
              { dataField: 'studentyear',   label: { text: 'ชั้นปี' }, editorOptions: { min: 1, max: 8, showSpinButtons: true } },
              { dataField: 'facultyid',     label: { text: 'คณะ' }, editorType: 'dxSelectBox',
                editorOptions: { dataSource: facultyCombo, valueExpr: 'comboid', displayExpr: 'comboshow', searchEnabled: true } },
              { dataField: 'programid',     label: { text: 'สาขาวิชา' }, editorType: 'dxSelectBox',
                editorOptions: { dataSource: programCombo, valueExpr: 'comboid', displayExpr: 'comboshow', searchEnabled: true } },
              { dataField: 'campusid',      label: { text: 'ศูนย์/วิทยาเขต' }, editorType: 'dxSelectBox',
                editorOptions: { dataSource: campusCombo, valueExpr: 'comboid', displayExpr: 'comboshow' } },
              { dataField: 'gpa',           label: { text: 'GPA' }, editorOptions: { min: 0, max: 4, format: '#,##0.00' } },
              { dataField: 'admitdate',     label: { text: 'วันที่รับเข้า' }, editorType: 'dxDateBox', colSpan: 2 },
            ]},
          ],
        },
      },
      export: { enabled: true, formats: ['xlsx'], fileName: 'student-master' },
      thaiDate: true,
      thaiDateFormat: 'medium',
    };
  }

  /** แปลง * wildcard เป็น regex ตรวจสอบ case-insensitive */
  private matchWildcard(value: string, pattern: string): boolean {
    const p = pattern.trim();
    if (!p) return true;
    // แปลง * เป็น regex .*
    const regex = new RegExp('^' + p.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*') + '$', 'i');
    return regex.test(value);
  }

  search() {
    let result = this.mock.students;
    if (this.studentcode.trim())    result = result.filter(s => this.matchWildcard(s.studentcode, this.studentcode));
    if (this.studentname.trim())    result = result.filter(s => this.matchWildcard(s.studentname, this.studentname));
    if (this.studentsurname.trim()) result = result.filter(s => this.matchWildcard(s.studentsurname, this.studentsurname));
    if (this.studentstatus)         result = result.filter(s => s.studentstatus === this.studentstatus);
    if (this.facultyid)             result = result.filter(s => s.facultyid === this.facultyid);
    this.buildGridOptions(result);
  }

  clearSearch() {
    this.studentcode = ''; this.studentname = ''; this.studentsurname = '';
    this.studentstatus = null; this.facultyid = null;
    this.buildGridOptions(this.mock.students);
  }
}
