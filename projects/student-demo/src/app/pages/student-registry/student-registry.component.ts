import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  DatagridComponent, DataGridOptions, FormTab,
  TextBoxComponent, SelectBoxComponent, NumberBoxComponent, ButtonComponent,
} from '@darkoum/ng-datagrid';
import { MockDataService, Student } from '../../core/mock-data.service';

@Component({
  selector: 'app-student-registry',
  standalone: true,
  imports: [CommonModule, FormsModule, DatagridComponent,
    TextBoxComponent, SelectBoxComponent, NumberBoxComponent, ButtonComponent],
  templateUrl: './student-registry.component.html',
  styleUrl: './student-registry.component.scss',
})
export class StudentRegistryComponent {
  readonly mock = inject(MockDataService);

  // ─── Search fields ────────────────────────────────────────────────────────
  studentcode    = '';
  studentname    = '';
  studentsurname = '';
  citizenid      = '';
  studentstatus: number | null = null;
  facultyid:     number | null = null;
  programid:     number | null = null;
  campusid:      number | null = null;

  // ─── Grid options ─────────────────────────────────────────────────────────
  gridOptions!: DataGridOptions<Student>;

  // ─── Additional combos for form ───────────────────────────────────────────
  readonly nationCombo = [
    { comboid: 1, comboshow: 'ไทย' }, { comboid: 2, comboshow: 'จีน' },
    { comboid: 3, comboshow: 'ญี่ปุ่น' }, { comboid: 4, comboshow: 'อื่นๆ' },
  ];
  readonly religionCombo = [
    { comboid: 1, comboshow: 'พุทธ' }, { comboid: 2, comboshow: 'คริสต์' },
    { comboid: 3, comboshow: 'อิสลาม' }, { comboid: 4, comboshow: 'อื่นๆ' },
  ];
  readonly bloodCombo = [
    { comboid: 'A', comboshow: 'A' }, { comboid: 'B', comboshow: 'B' },
    { comboid: 'O', comboshow: 'O' }, { comboid: 'AB', comboshow: 'AB' },
  ];
  readonly webflagCombo = [
    { comboid: 'Y', comboshow: 'Y : ปกติ' },
    { comboid: 'A', comboshow: 'A : Lock System โดยที่ปรึกษา' },
    { comboid: 'J', comboshow: 'J : Lock System โดยเจ้าหน้าที่' },
  ];
  readonly provinceCombo = [
    { comboid: 1, comboshow: 'กรุงเทพมหานคร' }, { comboid: 2, comboshow: 'เชียงใหม่' },
    { comboid: 3, comboshow: 'ภูเก็ต' }, { comboid: 4, comboshow: 'นนทบุรี' },
    { comboid: 5, comboshow: 'ขอนแก่น' },
  ];
  readonly fatherStatusCombo = [
    { comboid: 1, comboshow: 'มีชีวิต' }, { comboid: 2, comboshow: 'เสียชีวิต' }, { comboid: 3, comboshow: 'หย่าร้าง' },
  ];
  readonly degreeCombo = [
    { comboid: 1, comboshow: 'ประถมศึกษา' }, { comboid: 2, comboshow: 'มัธยมศึกษา' },
    { comboid: 3, comboshow: 'ปริญญาตรี' }, { comboid: 4, comboshow: 'ปริญญาโท' }, { comboid: 5, comboshow: 'ปริญญาเอก' },
  ];
  readonly workingStatusCombo = [
    { comboid: 1, comboshow: 'ทำงานประจำ' }, { comboid: 2, comboshow: 'ธุรกิจส่วนตัว' },
    { comboid: 3, comboshow: 'ไม่ได้ทำงาน' },
  ];

  constructor() {
    this.buildGridOptions(this.mock.students);
  }

  // ─── Build popup tabs ─────────────────────────────────────────────────────
  private buildTabs(): FormTab[] {
    const prefixOpts = { dataSource: this.mock.prefixCombo, valueExpr: 'comboid', displayExpr: 'comboshow', searchEnabled: true };
    const statusOpts = { dataSource: this.mock.statusCombo, valueExpr: 'comboid', displayExpr: 'comboshow' };
    const campusOpts = { dataSource: this.mock.campusCombo, valueExpr: 'comboid', displayExpr: 'comboshow' };
    const facOpts    = { dataSource: this.mock.facultyCombo, valueExpr: 'comboid', displayExpr: 'comboshow', searchEnabled: true };
    const progOpts   = { dataSource: this.mock.programCombo, valueExpr: 'comboid', displayExpr: 'comboshow', searchEnabled: true };
    const acadOpts   = { dataSource: this.mock.acadCombo, valueExpr: 'comboid', displayExpr: 'comboshow' };
    const feeOpts    = { dataSource: this.mock.feeGroupCombo, valueExpr: 'comboid', displayExpr: 'comboshow' };
    const schOpts    = { dataSource: this.mock.scheduleCombo, valueExpr: 'comboid', displayExpr: 'comboshow' };
    const webOpts    = { dataSource: this.webflagCombo, valueExpr: 'comboid', displayExpr: 'comboshow' };
    const natOpts    = { dataSource: this.nationCombo, valueExpr: 'comboid', displayExpr: 'comboshow' };
    const relOpts    = { dataSource: this.religionCombo, valueExpr: 'comboid', displayExpr: 'comboshow' };
    const bldOpts    = { dataSource: this.bloodCombo, valueExpr: 'comboid', displayExpr: 'comboshow' };
    const prvOpts    = { dataSource: this.provinceCombo, valueExpr: 'comboid', displayExpr: 'comboshow', searchEnabled: true };
    const fatOpts    = { dataSource: this.fatherStatusCombo, valueExpr: 'comboid', displayExpr: 'comboshow' };
    const degOpts    = { dataSource: this.degreeCombo, valueExpr: 'comboid', displayExpr: 'comboshow' };
    const wrkOpts    = { dataSource: this.workingStatusCombo, valueExpr: 'comboid', displayExpr: 'comboshow' };

    return [
      // ─── Tab 1: ข้อมูลนักศึกษา ─────────────────────────────────────────
      {
        title: '👤 ข้อมูลนักศึกษา',
        items: [
          {
            itemType: 'group', caption: 'รหัสและชื่อ', colCount: 2,
            items: [
              { dataField: 'studentcode', label: { text: 'รหัสนักศึกษา' }, isRequired: true },
              { itemType: 'empty' },
              { dataField: 'prefixid',       label: { text: 'คำนำหน้า' },      editorType: 'dxSelectBox', editorOptions: prefixOpts },
              { dataField: 'studentname',    label: { text: 'ชื่อ (ไทย)' },    isRequired: true },
              { dataField: 'studentsurname', label: { text: 'นามสกุล (ไทย)' }, isRequired: true },
              { itemType: 'empty' },
              { dataField: 'studentnameeng',    label: { text: 'ชื่อ (อังกฤษ)' } },
              { dataField: 'studentsurnameeng', label: { text: 'นามสกุล (อังกฤษ)' } },
            ],
          },
          {
            itemType: 'group', caption: 'ข้อมูลการศึกษา', colCount: 2,
            items: [
              { dataField: 'studentstatus', label: { text: 'สถานภาพ' },          editorType: 'dxSelectBox', editorOptions: { ...statusOpts, readOnly: true } },
              { dataField: 'campusid',      label: { text: 'ศูนย์/วิทยาเขต' },   editorType: 'dxSelectBox', editorOptions: { ...campusOpts, readOnly: true } },
              { dataField: 'facultyid',     label: { text: 'คณะ' },              editorType: 'dxSelectBox', editorOptions: { ...facOpts, readOnly: true } },
              { dataField: 'programid',     label: { text: 'สาขาวิชา' },         editorType: 'dxSelectBox', editorOptions: { ...progOpts, readOnly: true } },
              { dataField: 'admitacadyear', label: { text: 'ปีที่เข้า' },         editorType: 'dxNumberBox', editorOptions: { min: 2540, max: 2590 } },
              { dataField: 'admitsemester', label: { text: 'ภาคที่เข้า' },        editorType: 'dxNumberBox', editorOptions: { min: 1, max: 3 } },
              { dataField: 'webflag',       label: { text: 'สิทธิ์ใช้ระบบ' },    editorType: 'dxSelectBox', editorOptions: webOpts },
              { dataField: 'acadid',        label: { text: 'การประเมินผล' },      editorType: 'dxSelectBox', editorOptions: acadOpts },
              { dataField: 'feegroupid',    label: { text: 'บัญชีค่าใช้จ่าย' }, editorType: 'dxSelectBox', editorOptions: feeOpts },
              { dataField: 'schedulegroupid', label: { text: 'ปฏิทินการศึกษา' }, editorType: 'dxSelectBox', editorOptions: schOpts },
            ],
          },
          {
            itemType: 'group', caption: 'ผลการเรียน', colCount: 2,
            items: [
              { dataField: 'admitdate',    label: { text: 'วันที่รับเข้า' },     editorType: 'dxDateBox' },
              { dataField: 'finishdate',   label: { text: 'วันที่จบ/พ้นสภาพ' }, editorType: 'dxDateBox' },
              { dataField: 'studentyear',  label: { text: 'ชั้นปี' },            editorType: 'dxNumberBox', editorOptions: { min: 1, max: 8, readOnly: true } },
              { dataField: 'gpa',          label: { text: 'GPA' },               editorType: 'dxNumberBox', editorOptions: { readOnly: true } },
              { dataField: 'creditattempt', label: { text: 'หน่วยกิตลงแล้ว' },   editorType: 'dxNumberBox', editorOptions: { readOnly: true } },
              { dataField: 'creditsatisfy', label: { text: 'หน่วยกิตได้รับ' },   editorType: 'dxNumberBox', editorOptions: { readOnly: true } },
            ],
          },
        ],
      },
      // ─── Tab 2: ข้อมูลส่วนบุคคล ────────────────────────────────────────
      {
        title: '📋 ข้อมูลส่วนบุคคล',
        items: [
          {
            itemType: 'group', caption: 'ข้อมูลส่วนบุคคล', colCount: 2,
            items: [
              { dataField: 'birthdate',        label: { text: 'วัน/เดือน/ปีเกิด' },    editorType: 'dxDateBox' },
              { dataField: 'birthprovinceid',  label: { text: 'ภูมิลำเนา (จังหวัด)' }, editorType: 'dxSelectBox', editorOptions: prvOpts },
              { dataField: 'nationid',         label: { text: 'สัญชาติ' },              editorType: 'dxSelectBox', editorOptions: natOpts },
              { dataField: 'religionid',       label: { text: 'ศาสนา' },               editorType: 'dxSelectBox', editorOptions: relOpts },
              { dataField: 'bloodgroup',       label: { text: 'หมู่โลหิต' },           editorType: 'dxSelectBox', editorOptions: bldOpts },
              { dataField: 'foodallergies',    label: { text: 'ประวัติแพ้อาหาร/ยา' } },
            ],
          },
          {
            itemType: 'group', caption: 'หนังสือเดินทางและวีซ่า', colCount: 2,
            items: [
              { dataField: 'citizenid',        label: { text: 'เลขบัตรประชาชน/Passport' }, colSpan: 2 },
              { dataField: 'passportstartdate', label: { text: 'วันที่ออก Passport' },   editorType: 'dxDateBox' },
              { dataField: 'passportenddate',  label: { text: 'วันหมดอายุ Passport' },   editorType: 'dxDateBox' },
              { dataField: 'visastartdate',    label: { text: 'วันที่ออก Visa' },         editorType: 'dxDateBox' },
              { dataField: 'visaexpire',       label: { text: 'วันหมดอายุ Visa' },        editorType: 'dxDateBox' },
            ],
          },
          {
            itemType: 'group', caption: 'การศึกษาเดิม', colCount: 2,
            items: [
              { dataField: 'schoolname',         label: { text: 'สถานศึกษาเดิม' } },
              { dataField: 'entrydegreename',    label: { text: 'วุฒิเดิม' } },
              { dataField: 'entrygraduatedate',  label: { text: 'วันที่สำเร็จ' }, editorType: 'dxDateBox' },
            ],
          },
        ],
      },
      // ─── Tab 3: ที่อยู่ ──────────────────────────────────────────────────
      {
        title: '🏠 ที่อยู่',
        items: [
          {
            itemType: 'group', caption: 'ที่อยู่ตามทะเบียนบ้าน', colCount: 2,
            items: [
              { dataField: 'homeadd',        label: { text: 'บ้านเลขที่' } },
              { dataField: 'homemoo',        label: { text: 'หมู่' } },
              { dataField: 'homesoi',        label: { text: 'ตรอก/ซอย' } },
              { dataField: 'homestreet',     label: { text: 'ถนน' } },
              { dataField: 'homeprovinceid', label: { text: 'จังหวัด' }, editorType: 'dxSelectBox', editorOptions: prvOpts },
              { dataField: 'homezipcode',    label: { text: 'รหัสไปรษณีย์' } },
              { dataField: 'homephoneno',    label: { text: 'โทรศัพท์' } },
              { dataField: 'studentemail',   label: { text: 'อีเมล' } },
            ],
          },
          {
            itemType: 'group', caption: 'ที่อยู่ปัจจุบัน', colCount: 2,
            items: [
              { dataField: 'currentadd',        label: { text: 'บ้านเลขที่' } },
              { dataField: 'currentmoo',        label: { text: 'หมู่' } },
              { dataField: 'currentsoi',        label: { text: 'ตรอก/ซอย' } },
              { dataField: 'currentstreet',     label: { text: 'ถนน' } },
              { dataField: 'currentprovinceid', label: { text: 'จังหวัด' }, editorType: 'dxSelectBox', editorOptions: prvOpts },
              { dataField: 'currentzipcode',    label: { text: 'รหัสไปรษณีย์' } },
              { dataField: 'currentphoneno',    label: { text: 'โทรศัพท์' } },
            ],
          },
        ],
      },
      // ─── Tab 4: บิดา/มารดา ──────────────────────────────────────────────
      {
        title: '👨‍👩 บิดา/มารดา',
        items: [
          {
            itemType: 'group', caption: 'ข้อมูลบิดา', colCount: 2,
            items: [
              { dataField: 'fatherprefixid',  label: { text: 'คำนำหน้า' }, editorType: 'dxSelectBox', editorOptions: prefixOpts },
              { dataField: 'fatherstatus',    label: { text: 'สถานะ' },     editorType: 'dxSelectBox', editorOptions: fatOpts },
              { dataField: 'fathername',      label: { text: 'ชื่อ' } },
              { dataField: 'fathersurname',   label: { text: 'นามสกุล' } },
              { dataField: 'fatherbirthdate', label: { text: 'วันเกิด' }, editorType: 'dxDateBox' },
              { dataField: 'fatherdegree',    label: { text: 'วุฒิการศึกษา' }, editorType: 'dxSelectBox', editorOptions: degOpts },
              { dataField: 'fatheroccup',     label: { text: 'อาชีพ' } },
              { dataField: 'fatherrevenue',   label: { text: 'รายได้' }, editorType: 'dxNumberBox' },
            ],
          },
          {
            itemType: 'group', caption: 'ข้อมูลมารดา', colCount: 2,
            items: [
              { dataField: 'motherprefixid',  label: { text: 'คำนำหน้า' }, editorType: 'dxSelectBox', editorOptions: prefixOpts },
              { dataField: 'motherstatus',    label: { text: 'สถานะ' },     editorType: 'dxSelectBox', editorOptions: fatOpts },
              { dataField: 'mothername',      label: { text: 'ชื่อ' } },
              { dataField: 'mothersurname',   label: { text: 'นามสกุล' } },
              { dataField: 'motherbirthdate', label: { text: 'วันเกิด' }, editorType: 'dxDateBox' },
              { dataField: 'motherdegree',    label: { text: 'วุฒิการศึกษา' }, editorType: 'dxSelectBox', editorOptions: degOpts },
              { dataField: 'motheroccup',     label: { text: 'อาชีพ' } },
              { dataField: 'motherrevenue',   label: { text: 'รายได้' }, editorType: 'dxNumberBox' },
            ],
          },
        ],
      },
      // ─── Tab 5: ผู้ปกครอง / การทำงาน ────────────────────────────────────
      {
        title: '🏢 ผู้ปกครอง/การทำงาน',
        items: [
          {
            itemType: 'group', caption: 'ข้อมูลผู้ปกครอง', colCount: 2,
            items: [
              { dataField: 'parentprefixid', label: { text: 'คำนำหน้า' }, editorType: 'dxSelectBox', editorOptions: prefixOpts },
              { dataField: 'parentrelation', label: { text: 'ความสัมพันธ์' } },
              { dataField: 'parentname',     label: { text: 'ชื่อ' } },
              { dataField: 'parentsurname',  label: { text: 'นามสกุล' } },
              { dataField: 'parentphoneno',  label: { text: 'โทรศัพท์' } },
              { dataField: 'parentoccup',    label: { text: 'อาชีพ' } },
            ],
          },
          {
            itemType: 'group', caption: 'สถานะการทำงานปัจจุบัน', colCount: 2,
            items: [
              { dataField: 'officename',      label: { text: 'ชื่อบริษัท' }, colSpan: 2 },
              { dataField: 'workingstatus',   label: { text: 'สถานะการทำงาน' }, editorType: 'dxSelectBox', editorOptions: wrkOpts },
              { dataField: 'workingsalary',   label: { text: 'รายได้' }, editorType: 'dxNumberBox' },
              { dataField: 'officeprovinceid', label: { text: 'จังหวัด' }, editorType: 'dxSelectBox', editorOptions: prvOpts },
              { dataField: 'officephoneno',   label: { text: 'โทรศัพท์' } },
            ],
          },
        ],
      },
    ];
  }

  private buildGridOptions(data: Student[]): void {
    this.gridOptions = {
      keyExpr: 'studentid',
      dataSource: { store: data },
      columns: [
        { dataField: 'studentcode',    caption: 'รหัสนักศึกษา', width: 130 },
        { dataField: 'prefixid',       caption: 'คำนำหน้า',     width: 90,
          lookup: { dataSource: this.mock.prefixCombo, valueExpr: 'comboid', displayExpr: 'comboshow' } },
        { dataField: 'studentname',    caption: 'ชื่อ' },
        { dataField: 'studentsurname', caption: 'นามสกุล' },
        { dataField: 'studentstatus',  caption: 'สถานภาพ', width: 140,
          lookup: { dataSource: this.mock.statusCombo, valueExpr: 'comboid', displayExpr: 'comboshow' } },
        { dataField: 'studentyear',    caption: 'ชั้นปี', width: 60, alignment: 'center' },
        { dataField: 'gpa',            caption: 'GPA', width: 65, format: '0.00', alignment: 'right' },
        { dataField: 'facultyid',      caption: 'คณะ',
          lookup: { dataSource: this.mock.facultyCombo, valueExpr: 'comboid', displayExpr: 'comboshow' } },
        { dataField: 'admitdate',      caption: 'วันที่รับเข้า', width: 120, dataType: 'date', format: 'mediumDate' },
      ],
      paging:  { enabled: true, pageSize: 15 },
      pager:   { showPageSizeSelector: true, allowedPageSizes: [15, 20, 25] },
      showBorders: true,
      rowAlternationEnabled: true,
      hoverStateEnabled: true,
      searchPanel: { visible: true, width: 240, placeholder: 'ค้นหา...' },
      sorting: { mode: 'multiple' },
      editing: {
        mode: 'popup',
        allowUpdating: true,
        allowDeleting: false,
        useIcons: true,
        popup: { title: 'ระเบียนนักศึกษา', showTitle: true, width: 860 },
        form: { tabs: this.buildTabs() },
        texts: { saveRowChanges: 'บันทึก', cancelRowChanges: 'ยกเลิก' },
      },
      onRowUpdated: (e) => {
        const idx = this.mock.students.findIndex(s => s.studentid === (e.data as any).studentid);
        if (idx >= 0) Object.assign(this.mock.students[idx], e.data);
      },
      export: { enabled: true, formats: ['xlsx'], fileName: 'student-registry' },
    };
  }

  search(): void {
    let result = this.mock.students;
    if (this.studentcode.trim())    result = result.filter(s => s.studentcode.includes(this.studentcode.trim()));
    if (this.studentname.trim())    result = result.filter(s => s.studentname.includes(this.studentname.trim()));
    if (this.studentsurname.trim()) result = result.filter(s => s.studentsurname.includes(this.studentsurname.trim()));
    if (this.studentstatus)         result = result.filter(s => s.studentstatus === this.studentstatus);
    if (this.facultyid)             result = result.filter(s => s.facultyid === this.facultyid);
    if (this.programid)             result = result.filter(s => s.programid === this.programid);
    if (this.campusid)              result = result.filter(s => s.campusid === this.campusid);
    this.buildGridOptions(result);
  }

  clearSearch(): void {
    this.studentcode = ''; this.studentname = ''; this.studentsurname = '';
    this.citizenid = ''; this.studentstatus = null; this.facultyid = null;
    this.programid = null; this.campusid = null;
    this.buildGridOptions(this.mock.students);
  }
}
