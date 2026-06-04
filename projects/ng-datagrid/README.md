# @darkoum/ng-datagrid

> Angular 21 DataGrid + UI Components — Drop-in replacement สำหรับ DevExtreme  
> ✅ Standalone · ✅ Signals · ✅ ไม่ต้องซื้อ License · ✅ Thai Date (พ.ศ.)

**Demo:** https://darkoum.github.io/ng-datagrid/  
**npm:** `@darkoum/ng-datagrid@1.1.0` (GitHub Packages)

---

## ติดตั้ง

```bash
# 1. เพิ่ม .npmrc ในโปรเจคของคุณ
echo "@darkoum:registry=https://npm.pkg.github.com" >> .npmrc
echo "//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN" >> .npmrc

# 2. ติดตั้ง
npm install @darkoum/ng-datagrid
```

> GitHub Token ต้องมีสิทธิ์ `read:packages`  
> สร้างได้ที่ GitHub → Settings → Developer settings → Personal access tokens

---

## Quick Start

```typescript
import { DatagridComponent, DataGridOptions } from '@darkoum/ng-datagrid';

@Component({
  standalone: true,
  imports: [DatagridComponent],
  template: `<app-datagrid [options]="gridOptions" />`
})
export class MyComponent {
  gridOptions: DataGridOptions = {
    keyExpr: 'id',
    dataSource: { store: myData },
    columns: [
      { dataField: 'name',      caption: 'ชื่อ' },
      { dataField: 'orderDate', caption: 'วันที่', dataType: 'date', format: 'medium' },
      { dataField: 'total',     caption: 'ยอดรวม', format: '#,##0.00', alignment: 'right' },
    ],
    paging:  { enabled: true, pageSize: 20 },
    editing: { mode: 'popup', allowUpdating: true, allowDeleting: true },
    showBorders: true,
    rowAlternationEnabled: true,
  };
}
```

---

## Components

| Component | แทน DevExtreme | Import |
|-----------|---------------|--------|
| `<app-datagrid>` | `dx-data-grid` | `DatagridComponent` |
| `<app-text-box>` | `dx-text-box` | `TextBoxComponent` |
| `<app-select-box>` | `dx-select-box` | `SelectBoxComponent` |
| `<app-number-box>` | `dx-number-box` | `NumberBoxComponent` |
| `<app-thai-datepicker>` | `dx-date-box` | `ThaiDatepickerComponent` |
| `<app-button>` | `dx-button` | `ButtonComponent` |
| `<app-check-box>` | `dx-check-box` | `CheckBoxComponent` |
| `<app-tag-box>` | `dx-tag-box` | `TagBoxComponent` |
| `<app-radio-group>` | `dx-radio-group` | `RadioGroupComponent` |
| `<app-text-area>` | `dx-text-area` | `TextAreaComponent` |
| `<app-switch>` | `dx-switch` | `SwitchComponent` |
| `<app-popup>` | `dx-popup` | `PopupComponent` |
| `<app-tab-panel>` | `dx-tab-panel` | `TabPanelComponent` |
| `<app-form>` | `dx-form` | `FormComponent` |
| `thaiDate` pipe | — | `ThaiDatePipe` |

---

## DataGrid — Options Reference

### ตัวเลือกหลัก

```typescript
interface DataGridOptions<T> {
  keyExpr: string;                    // field ที่เป็น primary key (บังคับ)
  dataSource: {
    store?: T[];                      // ข้อมูล array โดยตรง
    load?: (params) => Observable<T[] | PagedResult<T>>;  // async load
  };
  columns: GridColumn[];              // คำจำกัดความของคอลัมน์
  showBorders?: boolean;              // แสดงเส้นขอบ (default: false)
  rowAlternationEnabled?: boolean;    // สลับสีแถว (default: false)
  hoverStateEnabled?: boolean;        // highlight เมื่อ hover (default: false)
  thaiDate?: boolean;                 // แสดงวันที่เป็น พ.ศ. (default: false)
}
```

### คอลัมน์ (GridColumn)

```typescript
interface GridColumn {
  dataField: string;                  // field name ใน data object
  caption?: string;                   // หัวคอลัมน์
  width?: number;                     // ความกว้าง (px)
  alignment?: 'left' | 'center' | 'right';
  dataType?: 'string' | 'number' | 'date' | 'boolean';
  format?: string;                    // '#,##0.00', '0.00', 'medium', 'short' ฯลฯ
  visible?: boolean;                  // แสดง/ซ่อน (default: true)
  allowSorting?: boolean;             // อนุญาตเรียงลำดับ (default: true)
  allowFiltering?: boolean;           // อนุญาต filter (default: true)
  allowEditing?: boolean;             // อนุญาตแก้ไข (default: true)
  lookup?: {                          // แสดงชื่อแทนค่า (เหมือน dxo-lookup)
    dataSource: any[];
    valueExpr: string;
    displayExpr: string;
  };
}
```

### Paging & Pager

```typescript
paging?: {
  enabled: boolean;      // เปิด/ปิด pagination
  pageSize?: number;     // จำนวนแถวต่อหน้า (default: 20)
};
pager?: {
  showPageSizeSelector?: boolean;         // แสดง dropdown เลือก pageSize
  allowedPageSizes?: number[];            // เช่น [10, 20, 50]
  showInfo?: boolean;                     // แสดงข้อความ "หน้า X จาก Y"
};
```

### Sorting & Filter

```typescript
sorting?: {
  mode: 'single' | 'multiple' | 'none';
};
filterRow?: {
  visible: boolean;      // แสดง filter row ใต้ header
};
```

### Toolbar

```typescript
toolbar?: {
  items: Array<{
    widget: 'button';
    options: { text: string; type?: string; onClick: () => void };
    location?: 'before' | 'after';
  }>;
};
```

---

## Editing Modes

### 1. Row Editing (Inline)

คลิก ✏️ แก้ไขตรงในแถว เหมาะกับข้อมูลที่ไม่ซับซ้อน

```typescript
editing: {
  mode: 'row',
  allowUpdating: true,
  allowAdding: true,
  allowDeleting: true,
}
```

### 2. Popup Editing

เปิด dialog เมื่อแก้ไข/เพิ่ม เหมาะกับ form หลาย field

```typescript
editing: {
  mode: 'popup',
  allowUpdating: true,
  allowAdding: true,
  allowDeleting: true,
  popup: {
    title: 'แก้ไขข้อมูล',
    width: 800,
    height: 500,
  },
  form: {
    colCount: 2,          // 1 หรือ 2 คอลัมน์
    items: [
      { dataField: 'name',    label: { text: 'ชื่อ' },     isRequired: true },
      { dataField: 'status',  label: { text: 'สถานภาพ' },  editorType: 'dxSelectBox',
        editorOptions: { dataSource: statusList, valueExpr: 'id', displayExpr: 'name' } },
      { itemType: 'group', caption: 'ที่อยู่', colCount: 2, items: [
        { dataField: 'address', label: { text: 'ที่อยู่' } },
        { dataField: 'city',    label: { text: 'จังหวัด' } },
      ]},
    ]
  }
}
```

### 3. Tabbed Popup Editing (FormTab)

Popup ที่มีแท็บหลายแท็บ เหมาะกับ form ขนาดใหญ่ เช่น ข้อมูลนักศึกษา

```typescript
editing: {
  mode: 'popup',
  allowUpdating: true,
  allowAdding: true,
  popup: { title: 'ข้อมูลนักศึกษา', width: 900, height: 600 },
  form: {
    tabs: [
      {
        title: '📋 ข้อมูลหลัก',
        items: [
          { dataField: 'studentcode', label: { text: 'รหัสนักศึกษา' }, isRequired: true },
          { dataField: 'name',        label: { text: 'ชื่อ' },          isRequired: true },
        ]
      },
      {
        title: '🎓 การศึกษา',
        items: [
          { dataField: 'facultyid',  label: { text: 'คณะ' },     editorType: 'dxSelectBox',
            editorOptions: { dataSource: facultyList, valueExpr: 'id', displayExpr: 'name' } },
          { dataField: 'admitdate',  label: { text: 'วันที่รับเข้า' }, editorType: 'dxDateBox' },
        ]
      },
    ]
  }
}
```

### Callbacks

```typescript
editing: {
  // ...
  onSaving?:    (e: SavingEvent<T>) => void;    // ก่อนบันทึก (validate ได้)
  onSaved?:     (e: SavedEvent<T>) => void;     // หลังบันทึก
  onDeleting?:  (e: DeletingEvent<T>) => void;  // ก่อนลบ
  onDeleted?:   (e: DeletedEvent<T>) => void;   // หลังลบ
}

// ตัวอย่างการ validate ก่อนบันทึก
onSaving: (e) => {
  if (!e.changes[0].data.name) {
    e.cancel = true;
    alert('กรุณากรอกชื่อ');
  }
}
```

---

## Row Events

```typescript
onRowClick?:    (e: { data: T; rowIndex: number; event: MouseEvent }) => void;
onRowDblClick?: (e: { data: T; rowIndex: number; event: MouseEvent }) => void;
onRowRemoved?:  (e: { data: T }) => void;
```

---

## Export Excel

```typescript
export?: {
  enabled: boolean;
  formats?: ('xlsx')[];
  fileName?: string;    // ไม่ต้องมี .xlsx (จะเพิ่มให้อัตโนมัติ)
}
```

ต้องติดตั้ง xlsx ด้วย:
```bash
npm install xlsx
```

---

## app-select-box

```html
<app-select-box
  [(ngModel)]="selectedValue"
  [dataSource]="items"
  displayExpr="name"
  valueExpr="id"
  [searchEnabled]="true"
  [showClearButton]="true"
  placeholder="-- เลือก --">
</app-select-box>
```

```typescript
import { SelectBoxComponent } from '@darkoum/ng-datagrid';

@Input() dataSource: any[] = [];
@Input() displayExpr: string = 'name';
@Input() valueExpr: string = 'id';
@Input() searchEnabled: boolean = false;
@Input() showClearButton: boolean = false;
@Input() placeholder: string = '';
@Input() disabled: boolean = false;
```

---

## app-text-box

```html
<app-text-box
  [(ngModel)]="value"
  placeholder="กรอกข้อความ"
  [showClearButton]="true"
  mode="password"
  (keydown.enter)="search()">
</app-text-box>
```

---

## app-number-box

```html
<app-number-box
  [(ngModel)]="quantity"
  [min]="0"
  [max]="100"
  [step]="1"
  [showSpinButtons]="true"
  format="#,##0">
</app-number-box>
```

---

## app-thai-datepicker

```html
<app-thai-datepicker
  [(ngModel)]="selectedDate"
  displayFormat="medium"
  [showClearButton]="true">
</app-thai-datepicker>
```

| Format | ผลลัพธ์ตัวอย่าง |
|--------|----------------|
| `short` | 25 ม.ค. 68 |
| `mediumDate` | 25 ม.ค. 2568 |
| `medium` | 25 มกราคม 2568 |
| `long` | วันศุกร์ที่ 25 มกราคม พ.ศ. 2568 |
| `shortDate` | 25/01/2568 |
| `shortDateTime` | 25 ม.ค. 68 10:30 |
| `mediumDateTime` | 25 ม.ค. 2568 10:30:00 |
| `timeOnly` | 10:30:00 |

---

## thaiDate Pipe

```html
{{ myDate | thaiDate:'medium' }}
{{ myDate | thaiDate:'long' }}
```

```typescript
import { ThaiDatePipe } from '@darkoum/ng-datagrid';

@Component({ imports: [ThaiDatePipe], ... })
```

---

## app-button

```html
<app-button text="บันทึก"    type="default" (onClick)="save()"></app-button>
<app-button text="ยกเลิก"   type="normal"  (onClick)="cancel()"></app-button>
<app-button text="ลบ"        type="danger"  (onClick)="delete()"></app-button>
<app-button text="โหลด..."  type="default" [disabled]="loading"></app-button>
```

| type | สี |
|------|----|
| `default` | น้ำเงิน (primary) |
| `normal` | เทา |
| `success` | เขียว |
| `danger` | แดง |
| `warning` | เหลือง |

---

## Migration จาก DevExtreme

| DevExtreme (v17) | @darkoum/ng-datagrid |
|------------------|----------------------|
| `<dx-data-grid [dataSource]="...">` | `<app-datagrid [options]="gridOptions">` |
| `<dxi-column dataField="name">` | `columns: [{ dataField: 'name', ... }]` |
| `<dxo-editing mode="popup">` | `editing: { mode: 'popup', ... }` |
| `<dxo-lookup [dataSource]="...">` | `lookup: { dataSource: ..., valueExpr, displayExpr }` |
| `<dx-text-box [(value)]="x">` | `<app-text-box [(ngModel)]="x">` |
| `<dx-select-box [(value)]="x">` | `<app-select-box [(ngModel)]="x">` |
| `HttpClientModule` | `provideHttpClient()` ใน app.config.ts |
| `BrowserModule` | ลบออกได้เลย |
| Class Guards | Functional Guards (`CanActivateFn`) |
| Class Interceptors | Functional Interceptors (`HttpInterceptorFn`) |

---

## ตัวอย่างโปรเจค

ดูตัวอย่างการใช้งานจริงในโปรเจค `student-demo`:

| หน้า | ฟีเจอร์ที่แสดง |
|------|--------------|
| ข้อมูลนักศึกษา | DataGrid + Popup Form 2 Groups |
| ระเบียนนักศึกษา | **Tabbed Popup Form** 5 แท็บ |
| สถานภาพนักศึกษา | DataGrid ซ้อนกัน + popup editing |
| ลงทะเบียน | onRowClick · click-to-add · credit bar |
| ผลการเรียน | Term tabs · GPAX summary badges |
| ประเทศ (Inline Edit) | `mode: 'row'` inline editing |
| วันที่ไทย | Thai Datepicker · thaiDate pipe |
