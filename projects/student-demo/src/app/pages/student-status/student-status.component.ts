import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  DatagridComponent, DataGridOptions,
  TextBoxComponent, ButtonComponent,
} from '@darkoum/ng-datagrid';
import { MockDataService, Student } from '../../core/mock-data.service';

@Component({
  selector: 'app-student-status',
  standalone: true,
  imports: [CommonModule, FormsModule, DatagridComponent, TextBoxComponent, ButtonComponent],
  templateUrl: './student-status.component.html',
  styleUrl:    './student-status.component.scss',
})
export class StudentStatusComponent {
  readonly mock = inject(MockDataService);

  searchCode = '';
  student    = signal<Student | null>(null);
  notFound   = signal(false);

  statusGridOptions  = signal<DataGridOptions<any> | null>(null);
  historyGridOptions = signal<DataGridOptions<any> | null>(null);

  search(): void {
    const code = this.searchCode.trim();
    if (!code) return;
    const found = this.mock.students.find(s => s.studentcode === code);
    this.student.set(found ?? null);
    this.notFound.set(!found);
    if (found) this.buildGrids(found.studentid);
    else { this.statusGridOptions.set(null); this.historyGridOptions.set(null); }
  }

  private buildGrids(studentid: number): void {
    const history = this.mock.studentStatusHistory[studentid] ?? this.makeEmptyHistory();

    this.statusGridOptions.set({
      keyExpr: 'id',
      dataSource: { store: history },
      columns: [
        { dataField: 'acadyear',          caption: 'ปีการศึกษา', width: 100 },
        { dataField: 'semester',          caption: 'ภาค',  width: 50, alignment: 'center' },
        { dataField: 'studentstatusshow', caption: 'สถานภาพ', width: 140 },
        { dataField: 'remark',            caption: 'หมายเหตุ' },
        { dataField: 'enrolltype',        caption: 'เงื่อนไข', width: 90,
          lookup: { dataSource: this.mock.enrollTypeCombo, valueExpr: 'comboid', displayExpr: 'comboshow' } },
        { dataField: 'enrollstatus',      caption: 'ลงทะเบียน', width: 120,
          lookup: { dataSource: this.mock.enrollStatusCombo, valueExpr: 'comboid', displayExpr: 'comboshow' } },
        { dataField: 'gradestatus',       caption: 'สถานะเกรด', width: 110,
          lookup: { dataSource: this.mock.gradeStatusCombo, valueExpr: 'comboid', displayExpr: 'comboshow' } },
        { dataField: 'creditattempt',     caption: 'CR:ลง',  width: 60, alignment: 'right' },
        { dataField: 'creditsatisfy',     caption: 'CR:ผ่าน', width: 65, alignment: 'right' },
        { dataField: 'sumcreditsatisfy',  caption: 'SUMCR',  width: 65, alignment: 'right' },
        { dataField: 'gpa',              caption: 'GPA',  width: 60, format: '0.00', alignment: 'right' },
        { dataField: 'gpax',             caption: 'GPAX', width: 65, format: '0.00', alignment: 'right' },
      ],
      showBorders: true,
      rowAlternationEnabled: true,
      hoverStateEnabled: true,
      paging: { enabled: true, pageSize: 10 },
      pager: { showPageSizeSelector: true, allowedPageSizes: [10, 0] },
      editing: {
        mode: 'popup',
        allowAdding: true,
        allowUpdating: true,
        allowDeleting: true,
        useIcons: true,
        popup: { title: 'บันทึกสถานะรายภาค', showTitle: true, width: 700 },
        form: {
          items: [
            {
              itemType: 'group', caption: 'ปีการศึกษา/ภาค', colCount: 2,
              items: [
                { dataField: 'acadyear', label: { text: 'ปีการศึกษา' }, editorType: 'dxNumberBox', editorOptions: { showSpinButtons: true, min: 2540, max: 2590 } },
                { dataField: 'semester', label: { text: 'ภาคที่' },      editorType: 'dxNumberBox', editorOptions: { showSpinButtons: true, min: 1, max: 3 } },
              ],
            },
            {
              itemType: 'group', caption: 'สถานภาพและหมายเหตุ', colCount: 1,
              items: [
                { dataField: 'studentstatus', label: { text: 'สถานภาพนักศึกษา' }, editorType: 'dxSelectBox',
                  editorOptions: { dataSource: this.mock.statusCombo, valueExpr: 'comboid', displayExpr: 'comboshow' } },
                { dataField: 'remark', label: { text: 'หมายเหตุ' }, editorType: 'dxTextArea', editorOptions: { rows: 2 } },
              ],
            },
            {
              itemType: 'group', caption: 'วันที่', colCount: 2,
              items: [
                { dataField: 'approvedate', label: { text: 'วันที่อนุมัติ' },  editorType: 'dxDateBox' },
                { dataField: 'datefrom',    label: { text: 'จากวันที่' },       editorType: 'dxDateBox' },
                { dataField: 'dateto',      label: { text: 'ถึงวันที่' },        editorType: 'dxDateBox' },
              ],
            },
            {
              itemType: 'group', caption: 'เงื่อนไขลงทะเบียน/เกรด', colCount: 2,
              items: [
                { dataField: 'enrolltype',   label: { text: 'เงื่อนไขลงทะเบียน' }, editorType: 'dxSelectBox',
                  editorOptions: { dataSource: this.mock.enrollTypeCombo, valueExpr: 'comboid', displayExpr: 'comboshow' } },
                { dataField: 'enrollstatus', label: { text: 'สถานะลงทะเบียน' },    editorType: 'dxSelectBox',
                  editorOptions: { dataSource: this.mock.enrollStatusCombo, valueExpr: 'comboid', displayExpr: 'comboshow' } },
                { dataField: 'gradestatus',  label: { text: 'สถานะเกรด' },          editorType: 'dxSelectBox',
                  editorOptions: { dataSource: this.mock.gradeStatusCombo, valueExpr: 'comboid', displayExpr: 'comboshow' } },
                { dataField: 'gradepro',     label: { text: 'สถานะเกรดเฉลี่ย' },   editorType: 'dxSelectBox',
                  editorOptions: { dataSource: this.mock.gradeProCombo, valueExpr: 'comboid', displayExpr: 'comboshow' } },
              ],
            },
          ],
        },
        texts: { addRow: 'เพิ่มรายการ', saveRowChanges: 'บันทึก', cancelRowChanges: 'ยกเลิก' },
      },
    });

    this.historyGridOptions.set({
      keyExpr: 'id',
      dataSource: { store: [...history].reverse() },
      columns: [
        { dataField: 'acadyear',          caption: 'ปีการศึกษา', width: 100 },
        { dataField: 'semester',          caption: 'ภาค',  width: 50, alignment: 'center' },
        { dataField: 'studentstatusshow', caption: 'สถานภาพ', width: 140 },
        { dataField: 'remark',            caption: 'หมายเหตุ' },
        { dataField: 'gpa',              caption: 'GPA',  width: 60, format: '0.00', alignment: 'right' },
        { dataField: 'gpax',             caption: 'GPAX', width: 65, format: '0.00', alignment: 'right' },
      ],
      showBorders: true,
      rowAlternationEnabled: true,
      paging: { enabled: true, pageSize: 10 },
      pager: { allowedPageSizes: [10, 0] },
    });
  }

  private makeEmptyHistory(): any[] { return []; }

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
