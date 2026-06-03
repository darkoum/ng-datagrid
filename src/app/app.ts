import { Component } from '@angular/core';
import { CommonModule, DecimalPipe, KeyValuePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  DatagridModule, DataGridOptions, ThaiDatePipe, ThaiDatepickerComponent,
  SelectBoxComponent, NumberBoxComponent, TextBoxComponent, ButtonComponent,
  PopupComponent, LoadPanelComponent,
  TabPanelComponent, TabItemComponent,
  AccordionComponent, AccordionItemComponent,
  CheckBoxComponent, DateBoxComponent, TagBoxComponent,
  RadioGroupComponent, TextAreaComponent, SwitchComponent,
  FormComponent, FormEditorTemplateDirective,
  SbValueChangedEvent, TbValueChangedEvent, TabSelectionChangedEvent,
  FieldDataChangedEvent, FormItem,
} from './shared/datagrid';

export interface Order {
  id: number;
  orderNo: string;
  orderDate: Date;
  dueDate: Date;
  customer: string;
  province: string;
  category: string;
  qty: number;
  unitPrice: number;
  total: number;
  status: string;
  isPaid: boolean;
}

// ─── สร้างข้อมูลสมจริง 50 รายการ ─────────────────────────────────────────────
const CUSTOMERS = [
  'สมชาย ใจดี', 'อนันต์ มั่นคง', 'กมลา รักไทย', 'วิชัย ศิลปะ', 'พรทิพย์ สุขใส',
  'นภดล ใจงาม', 'สุภาพร ดีเสมอ', 'มานะ ขยันดี', 'รัตนา สุวรรณ', 'ประสิทธิ์ คงดี',
  'วันดี มีสุข', 'ชัยชนะ เก่งกาจ', 'ศิริพร ดวงดี', 'บุญมา หาญกล้า', 'นงนุช สดใส',
  'ธีรวัฒน์ พงษ์ดี', 'กัญญา ใจเย็น', 'สุรชัย ขยัน', 'ปาลิดา ดีงาม', 'วิเชียร รุ่งเรือง',
];
const PROVINCES = [
  'กรุงเทพฯ', 'เชียงใหม่', 'ขอนแก่น', 'นครราชสีมา', 'ชลบุรี',
  'สงขลา', 'อุดรธานี', 'นนทบุรี', 'ปทุมธานี', 'ภูเก็ต',
];
const CATEGORIES = ['อิเล็กทรอนิกส์', 'เสื้อผ้า', 'อาหาร', 'เครื่องใช้ไฟฟ้า', 'เครื่องสำอาง'];
const STATUSES   = ['รอดำเนินการ', 'กำลังจัดส่ง', 'เสร็จสิ้น', 'ยกเลิก'];

function rnd(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function pick<T>(arr: T[]) { return arr[rnd(0, arr.length - 1)]; }

const MOCK_DATA: Order[] = Array.from({ length: 50 }, (_, i) => {
  const id        = i + 1;
  const qty       = rnd(1, 50);
  const unitPrice = rnd(200, 5000) * 10;
  const d         = new Date(2025, rnd(0, 11), rnd(1, 28));
  const due       = new Date(d.getTime() + rnd(7, 30) * 86400000);
  return {
    id,
    orderNo:   `ORD-${String(id).padStart(3, '0')}`,
    orderDate:  d,
    dueDate:    due,
    customer:   pick(CUSTOMERS),
    province:   pick(PROVINCES),
    category:   pick(CATEGORIES),
    qty,
    unitPrice,
    total:      qty * unitPrice,
    status:     pick(STATUSES),
    isPaid:     Math.random() > 0.4,
  };
});

// ─── Virtual scroll: 2,000 rows ────────────────────────────────────────────
const BIG_DATA: Order[] = Array.from({ length: 2000 }, (_, i) => {
  const id = i + 1;
  const qty = rnd(1, 20);
  const up  = rnd(100, 9999);
  const d   = new Date(2024 + rnd(0, 1), rnd(0, 11), rnd(1, 28));
  return {
    id, orderNo: `V-${String(id).padStart(5,'0')}`,
    orderDate: d, dueDate: new Date(d.getTime() + 14 * 86400000),
    customer: pick(CUSTOMERS), province: pick(PROVINCES),
    category: pick(CATEGORIES), qty, unitPrice: up, total: qty * up,
    status: pick(STATUSES), isPaid: Math.random() > 0.4,
  };
});

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, FormsModule, DecimalPipe, KeyValuePipe,
    DatagridModule, ThaiDatePipe, ThaiDatepickerComponent,
    SelectBoxComponent, NumberBoxComponent, TextBoxComponent, ButtonComponent,
    PopupComponent, LoadPanelComponent,
    TabPanelComponent, TabItemComponent,
    AccordionComponent, AccordionItemComponent,
    CheckBoxComponent, DateBoxComponent, TagBoxComponent,
    RadioGroupComponent, TextAreaComponent, SwitchComponent,
    FormComponent, FormEditorTemplateDirective,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  selectedDate: Date | null   = new Date(2025, 0, 15);  // preset วันที่ทดสอบ
  selectedDate2: Date | null  = null;
  selectedRows: Order[]       = [];
  activeTab = 0;

  // ─── Widget demo state ────────────────────────────────────────────────────
  wProvince:      string | null = null;
  wCategory:      string | null = null;
  wAcadYear:      number        = 2567;
  wQty:           number | null = null;
  wSearch:        string        = '';
  wPassword:      string        = 'secret';
  wLoading:       boolean       = false;
  wPopup:         boolean       = false;
  wPopupProvince: string | null = null;
  wTabText:       string        = '';
  lastBtnClick:   string        = '';
  lastTabIndex:   number        = 0;

  readonly provinceOptions = [
    { value: 'bkk',  label: 'กรุงเทพฯ' },
    { value: 'cnx',  label: 'เชียงใหม่' },
    { value: 'kkn',  label: 'ขอนแก่น' },
    { value: 'nma',  label: 'นครราชสีมา' },
    { value: 'cbi',  label: 'ชลบุรี' },
    { value: 'hkt',  label: 'ภูเก็ต' },
    { value: 'skl',  label: 'สงขลา' },
    { value: 'udr',  label: 'อุดรธานี' },
    { value: 'nbi',  label: 'นนทบุรี' },
    { value: 'ptn',  label: 'ปทุมธานี' },
  ];

  readonly categoryOptions = [
    { value: 'electronics', label: 'อิเล็กทรอนิกส์' },
    { value: 'clothing',    label: 'เสื้อผ้า' },
    { value: 'food',        label: 'อาหาร' },
    { value: 'books',       label: 'หนังสือ' },
    { value: 'sports',      label: 'กีฬา' },
  ];

  onProvinceChange(e: SbValueChangedEvent) {
    console.log('province changed:', e);
  }

  onSearchChange(e: TbValueChangedEvent) {
    console.log('search:', e.value);
  }

  onBtnClick(action: string) {
    this.lastBtnClick = `${action} @ ${new Date().toLocaleTimeString('th')}`;
  }

  showLoading() {
    this.wLoading = true;
    setTimeout(() => (this.wLoading = false), 2000);
  }

  onTabChange(e: TabSelectionChangedEvent) {
    this.lastTabIndex = e.selectedIndex;
  }

  // ─── สถิติสรุป ────────────────────────────────────────────────────────────
  get totalOrders()  { return MOCK_DATA.length; }
  get totalRevenue() { return MOCK_DATA.reduce((s, r) => s + r.total, 0); }
  get pendingCount() { return MOCK_DATA.filter(r => r.status === 'รอดำเนินการ').length; }
  get paidCount()    { return MOCK_DATA.filter(r => r.isPaid).length; }

  // ─── Grid 1: รายการสั่งซื้อครบ features ─────────────────────────────────
  grid1Options: DataGridOptions<Order> = {
    keyExpr:    'id',
    dataSource: { store: MOCK_DATA },
    columns: [
      { dataField: 'orderNo',   caption: 'เลขที่',       width: 110, allowSorting: true },
      { dataField: 'orderDate', caption: 'วันที่สั่ง',    dataType: 'date',   format: 'medium',   width: 175, allowSorting: true },
      { dataField: 'dueDate',   caption: 'วันครบกำหนด',  dataType: 'date',   format: 'shortDate', width: 135 },
      { dataField: 'customer',  caption: 'ลูกค้า',        allowSorting: true, allowFiltering: true },
      { dataField: 'province',  caption: 'จังหวัด',       width: 130, allowFiltering: true },
      { dataField: 'category',  caption: 'หมวดหมู่',      width: 150, allowFiltering: true },
      { dataField: 'qty',       caption: 'จำนวน',         dataType: 'number', alignment: 'right', width: 80 },
      { dataField: 'total',     caption: 'ยอดรวม (บาท)',  dataType: 'number', format: '#,##0.00', alignment: 'right', width: 145 },
      { dataField: 'isPaid',    caption: 'ชำระแล้ว',      dataType: 'boolean', width: 100, cellTemplate: 'paidTpl' },
      { dataField: 'status',    caption: 'สถานะ',         width: 130, cellTemplate: 'statusTpl' },
    ],
    paging:      { enabled: true, pageSize: 10 },
    pager:       { showPageSizeSelector: true, showInfo: true, allowedPageSizes: [10, 20, 50] },
    sorting:     { mode: 'multiple' },
    filterRow:   { visible: true },
    searchPanel: { visible: true, placeholder: 'ค้นหาลูกค้า, เลขที่...' },
    toolbar:     { items: ['searchPanel', 'exportButton'] },
    showBorders:          true,
    showRowLines:         true,
    rowAlternationEnabled: true,
    hoverStateEnabled:    true,
    allowColumnResizing:  true,
    thaiDate:             true,
    thaiDateFormat:       'medium',
    noDataText:           'ไม่พบข้อมูล',
  };

  // ─── Grid 2: Selection + inline edit ─────────────────────────────────────
  grid2Data = MOCK_DATA.slice(0, 20).map(r => ({ ...r }));

  grid2Options: DataGridOptions<Order> = {
    keyExpr:    'id',
    dataSource: { store: this.grid2Data },
    columns: [
      { dataField: 'orderNo',   caption: 'เลขที่',     width: 110 },
      { dataField: 'orderDate', caption: 'วันที่',      dataType: 'date',   format: 'shortDate', width: 130 },
      { dataField: 'customer',  caption: 'ลูกค้า',      allowFiltering: true },
      { dataField: 'province',  caption: 'จังหวัด',     width: 130 },
      { dataField: 'total',     caption: 'ยอดรวม',      dataType: 'number', format: '#,##0.00', alignment: 'right', width: 140 },
      { dataField: 'status',    caption: 'สถานะ',       width: 130, cellTemplate: 'statusTpl2' },
    ],
    paging:    { enabled: true, pageSize: 8 },
    pager:     { showInfo: true, showPageSizeSelector: true, allowedPageSizes: [8, 15, 20] },
    selection: { mode: 'multiple', showCheckBoxesMode: 'always' },
    sorting:   { mode: 'single' },
    filterRow: { visible: true },
    editing: {
      mode:          'row',
      allowUpdating: true,
      allowDeleting: true,
      confirmDelete: true,
      texts: {
        confirmDeleteMessage: 'ต้องการลบรายการนี้ใช่หรือไม่?',
        saveRowChanges:       'บันทึก',
        cancelRowChanges:     'ยกเลิก',
        deleteRow:            'ลบ',
      },
    },
    toolbar:             { items: ['searchPanel'] },
    showBorders:         true,
    showRowLines:        true,
    rowAlternationEnabled: true,
    hoverStateEnabled:   true,
    allowColumnResizing: true,
    thaiDate:            true,
    onSelectionChanged:  (e) => { this.selectedRows = e.selectedRowsData; },
  };

  // ─── Grid 3: Master-detail ────────────────────────────────────────────────
  grid3Options: DataGridOptions<Order> = {
    keyExpr:    'id',
    dataSource: { store: MOCK_DATA.slice(0, 15) },
    columns: [
      { dataField: 'orderNo',   caption: 'เลขที่',       width: 110 },
      { dataField: 'orderDate', caption: 'วันที่สั่ง',    dataType: 'date', format: 'medium', width: 175 },
      { dataField: 'customer',  caption: 'ลูกค้า',        allowSorting: true },
      { dataField: 'category',  caption: 'หมวดหมู่',      width: 150 },
      { dataField: 'total',     caption: 'ยอดรวม',        dataType: 'number', format: '#,##0.00', alignment: 'right', width: 145 },
      { dataField: 'status',    caption: 'สถานะ',         width: 130, cellTemplate: 'statusTpl3' },
    ],
    paging:       { enabled: true, pageSize: 8 },
    pager:        { showInfo: true },
    masterDetail: { enabled: true },
    sorting:      { mode: 'single' },
    showBorders:  true,
    showRowLines: true,
    rowAlternationEnabled: true,
    hoverStateEnabled:    true,
    thaiDate:     true,
  };

  // ─── Grid 4: Virtual scroll 2,000 rows ────────────────────────────────────
  grid4Options: DataGridOptions<Order> = {
    keyExpr:    'id',
    dataSource: { store: BIG_DATA },
    columns: [
      { dataField: 'orderNo',   caption: 'เลขที่',       width: 110 },
      { dataField: 'orderDate', caption: 'วันที่',        dataType: 'date', format: 'shortDate', width: 130 },
      { dataField: 'customer',  caption: 'ลูกค้า' },
      { dataField: 'province',  caption: 'จังหวัด',       width: 130 },
      { dataField: 'category',  caption: 'หมวดหมู่',      width: 150 },
      { dataField: 'qty',       caption: 'จำนวน',         dataType: 'number', alignment: 'right', width: 80 },
      { dataField: 'total',     caption: 'ยอดรวม',        dataType: 'number', format: '#,##0.00', alignment: 'right', width: 145 },
      { dataField: 'status',    caption: 'สถานะ',         width: 130 },
    ],
    paging:      { enabled: true, pageSize: 50 },
    pager:       { showInfo: true, showPageSizeSelector: true, allowedPageSizes: [50, 100, 200] },
    sorting:     { mode: 'single' },
    filterRow:   { visible: true },
    searchPanel: { visible: true, placeholder: 'ค้นหา...' },
    toolbar:     { items: ['searchPanel'] },
    scrolling:   { mode: 'virtual' },
    virtualScrollConfig: { itemHeight: 36, bufferSize: 10 },
    showBorders:          true,
    showRowLines:         true,
    rowAlternationEnabled: true,
    hoverStateEnabled:    true,
    allowColumnResizing:  true,
    thaiDate:             true,
    noDataText:           'ไม่พบข้อมูล',
  };

  // ─── Grid 5: Popup edit form — กรอกข้อมูลหลายฟิลด์ใน modal ─────────────────
  grid5Data = MOCK_DATA.slice(0, 15).map(r => ({ ...r }));

  grid5Options: DataGridOptions<Order> = {
    keyExpr:    'id',
    dataSource: { store: this.grid5Data },
    columns: [
      { dataField: 'orderNo',   caption: 'เลขที่',        width: 110, allowEditing: false },
      { dataField: 'orderDate', caption: 'วันที่สั่ง',     dataType: 'date',   format: 'shortDate', width: 130 },
      { dataField: 'dueDate',   caption: 'วันครบกำหนด',   dataType: 'date',   format: 'shortDate', width: 135 },
      { dataField: 'customer',  caption: 'ลูกค้า' },
      { dataField: 'province',  caption: 'จังหวัด',        width: 130 },
      { dataField: 'category',  caption: 'หมวดหมู่',       width: 140 },
      { dataField: 'qty',       caption: 'จำนวน',          dataType: 'number', alignment: 'right', width: 80 },
      { dataField: 'unitPrice', caption: 'ราคา/หน่วย',     dataType: 'number', format: '#,##0.00', alignment: 'right', width: 120 },
      { dataField: 'total',     caption: 'ยอดรวม',         dataType: 'number', format: '#,##0.00', alignment: 'right', width: 140, allowEditing: false },
      { dataField: 'status',    caption: 'สถานะ',          width: 130 },
      { dataField: 'isPaid',    caption: 'ชำระแล้ว',       dataType: 'boolean', width: 90 },
    ],
    paging: { enabled: true, pageSize: 8 },
    pager:  { showInfo: true, showPageSizeSelector: true, allowedPageSizes: [8, 15] },
    editing: {
      mode:          'popup',
      allowAdding:   true,
      allowUpdating: true,
      allowDeleting: true,
      confirmDelete: true,

      // ── popup config — เหมือน DevExtreme ──────────────────────
      popup: {
        title:     'รายละเอียดคำสั่งซื้อ',
        showTitle: true,       // default true
        width:     720,
        height:    480,
      },

      // ── form config — เหมือน DevExtreme editing.form ──────────
      form: {
        items: [
          {
            itemType: 'group',
            caption:  '📋 ข้อมูลคำสั่งซื้อ',
            colCount: 2,
            items: [
              { dataField: 'orderDate', label: { text: 'วันที่สั่งซื้อ' } },
              { dataField: 'dueDate',   label: { text: 'วันครบกำหนด' } },
              { dataField: 'customer',  label: { text: 'ชื่อลูกค้า' },  colSpan: 2 },
            ],
          },
          {
            itemType: 'group',
            caption:  '📦 รายละเอียดสินค้า',
            colCount: 2,
            items: [
              { dataField: 'category',  label: { text: 'หมวดหมู่' } },
              { dataField: 'province',  label: { text: 'จังหวัด' } },
              { dataField: 'qty',       label: { text: 'จำนวน (ชิ้น)' }, editorType: 'dxNumberBox' },
              { dataField: 'unitPrice', label: { text: 'ราคา/หน่วย (บาท)' }, editorType: 'dxNumberBox' },
            ],
          },
          {
            itemType: 'group',
            caption:  '📌 สถานะ',
            colCount: 2,
            items: [
              { dataField: 'status', label: { text: 'สถานะคำสั่งซื้อ' } },
              { dataField: 'isPaid', label: { text: 'ชำระเงินแล้ว' }, editorType: 'dxCheckBox' },
            ],
          },
        ],
      },

      texts: {
        addRow:               'เพิ่มคำสั่งซื้อ',
        saveRowChanges:       'บันทึก',
        cancelRowChanges:     'ยกเลิก',
        confirmDeleteMessage: 'ยืนยันการลบรายการนี้?',
      },
    },
    showBorders:           true,
    showRowLines:          true,
    rowAlternationEnabled: true,
    hoverStateEnabled:     true,
    allowColumnResizing:   true,
    thaiDate:              true,
    onRowInserted: (e) => console.log('[popup] inserted', e),
    onRowUpdated:  (e) => console.log('[popup] updated', e),
    onRowRemoved:  (e) => console.log('[popup] removed', e),
  };

  // ─── Standalone Form demo ─────────────────────────────────────────────────
  formData: Record<string, any> = {
    firstName:  'สมชาย',
    lastName:   'ใจดี',
    email:      'somchai@example.com',
    phone:      '081-234-5678',
    birthDate:  new Date(1990, 4, 15),
    gender:     'male',
    province:   'bkk',
    address:    '123/4 ถ.สุขุมวิท แขวงคลองเตย',
    zipcode:    '10110',
    department: 'it',
    position:   'developer',
    salary:     55000,
    startDate:  new Date(2022, 8, 1),
    isActive:   true,
    note:       '',
  };

  formLastChanged = '';

  readonly formItems: FormItem[] = [
    {
      itemType: 'group',
      caption:  '👤 ข้อมูลส่วนตัว',
      colCount: 2,
      items: [
        { dataField: 'firstName',  label: { text: 'ชื่อ' },       isRequired: true },
        { dataField: 'lastName',   label: { text: 'นามสกุล' },    isRequired: true },
        { dataField: 'gender',     label: { text: 'เพศ' },
          editorType: 'dxSelectBox',
          editorOptions: {
            dataSource: [
              { value: 'male',   label: 'ชาย' },
              { value: 'female', label: 'หญิง' },
              { value: 'other',  label: 'อื่นๆ' },
            ],
            valueExpr: 'value', displayExpr: 'label',
          },
        },
        { dataField: 'birthDate',  label: { text: 'วันเกิด' },    editorType: 'dxDateBox' },
        { dataField: 'email',      label: { text: 'อีเมล' },      colSpan: 2,
          editorOptions: { placeholder: 'example@domain.com' } },
        { dataField: 'phone',      label: { text: 'เบอร์โทร' },
          editorOptions: { placeholder: '0xx-xxx-xxxx' } },
        { dataField: 'isActive',   label: { text: 'สถานะ' },
          editorType: 'dxCheckBox',
          editorOptions: { text: 'พนักงานประจำ (ยังทำงานอยู่)' }, colSpan: 2 },
      ],
    },
    {
      itemType: 'group',
      caption:  '🏠 ที่อยู่',
      colCount: 2,
      items: [
        { dataField: 'address',   label: { text: 'ที่อยู่' },      colSpan: 2,
          editorType: 'dxTextArea',
          editorOptions: { rows: 2, placeholder: 'บ้านเลขที่ ถนน แขวง/ตำบล เขต/อำเภอ' } },
        { dataField: 'province',  label: { text: 'จังหวัด' },
          editorType: 'dxSelectBox',
          editorOptions: {
            dataSource: [
              { value: 'bkk', label: 'กรุงเทพมหานคร' },
              { value: 'cnx', label: 'เชียงใหม่' },
              { value: 'kkn', label: 'ขอนแก่น' },
              { value: 'nma', label: 'นครราชสีมา' },
              { value: 'hkt', label: 'ภูเก็ต' },
              { value: 'skl', label: 'สงขลา' },
            ],
            valueExpr: 'value', displayExpr: 'label',
          },
        },
        { dataField: 'zipcode',   label: { text: 'รหัสไปรษณีย์' },
          editorOptions: { placeholder: '10xxx' } },
      ],
    },
    {
      itemType: 'group',
      caption:  '💼 ข้อมูลการจ้างงาน',
      colCount: 2,
      items: [
        { dataField: 'department', label: { text: 'แผนก' },
          editorType: 'dxSelectBox',
          editorOptions: {
            dataSource: [
              { value: 'it',   label: 'ฝ่ายไอที' },
              { value: 'hr',   label: 'ฝ่ายบุคคล' },
              { value: 'fin',  label: 'ฝ่ายการเงิน' },
              { value: 'sales',label: 'ฝ่ายขาย' },
              { value: 'ops',  label: 'ฝ่ายปฏิบัติการ' },
            ],
            valueExpr: 'value', displayExpr: 'label',
          },
        },
        { dataField: 'position',  label: { text: 'ตำแหน่ง' } },
        { dataField: 'salary',    label: { text: 'เงินเดือน (บาท)' },
          editorType: 'dxNumberBox',
          editorOptions: { min: 0, step: 1000, placeholder: '0' } },
        { dataField: 'startDate', label: { text: 'วันที่เริ่มงาน' }, editorType: 'dxDateBox' },
        { dataField: 'note',      label: { text: 'หมายเหตุ' }, colSpan: 2,
          editorType: 'dxTextArea',
          editorOptions: { rows: 3, placeholder: 'หมายเหตุเพิ่มเติม...' } },
      ],
    },
  ];

  onFormFieldChanged(e: FieldDataChangedEvent): void {
    this.formLastChanged = `${e.dataField} → ${JSON.stringify(e.value)}`;
  }

  // ─── Widget showcase state ─────────────────────────────────────────────────
  wCheckBox   = true;
  wSwitch     = false;
  wDateBox: Date | null = new Date(2025, 5, 3);
  wTagBox:  any[]  = ['bkk', 'cnx'];
  wRadio    = 'M';
  wTextArea = 'ทดสอบ textarea\nบรรทัดสอง';

  readonly genderItems = [
    { value: 'M', text: 'ชาย' },
    { value: 'F', text: 'หญิง' },
    { value: 'O', text: 'ไม่ระบุ' },
  ];

  getStatusClass(s: string): string {
    return { 'รอดำเนินการ':'badge-warning','กำลังจัดส่ง':'badge-info','เสร็จสิ้น':'badge-success','ยกเลิก':'badge-danger' }[s] ?? 'badge-default';
  }

  get selectedTotal(): number {
    return this.selectedRows.reduce((s, r) => s + r.total, 0);
  }
}
