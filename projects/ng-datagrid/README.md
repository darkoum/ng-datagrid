# @darkoum/ng-datagrid

> Angular 21 DataGrid พร้อม Thai Date — Drop-in replacement สำหรับ DevExtreme  
> Standalone · Signals · ไม่ต้องซื้อ License

## ติดตั้ง

```bash
# 1. เพิ่ม .npmrc ในโปรเจคของคุณ
echo "@darkoum:registry=https://npm.pkg.github.com" >> .npmrc

# 2. ติดตั้ง
npm install @darkoum/ng-datagrid
```

## Components

| Component | แทน DevExtreme | คำอธิบาย |
|-----------|---------------|---------|
| `<app-datagrid>` | `dx-data-grid` | Sort, Filter, Pagination, Edit, Export |
| `<app-form>` | `dx-form` | Form builder with colCount, groups |
| `<app-thai-datepicker>` | `dx-date-box` | พ.ศ. calendar, 8 formats |
| `<app-select-box>` | `dx-select-box` | Searchable dropdown, CVA |
| `<app-number-box>` | `dx-number-box` | Spin buttons, format, CVA |
| `<app-text-box>` | `dx-text-box` | Clear, password, CVA |
| `<app-check-box>` | `dx-check-box` | Custom UI, indeterminate, CVA |
| `<app-tag-box>` | `dx-tag-box` | Multi-select, search, tags, CVA |
| `<app-radio-group>` | `dx-radio-group` | H/V layout, CVA |
| `<app-text-area>` | `dx-text-area` | maxLength counter, CVA |
| `<app-switch>` | `dx-switch` | Toggle animation, on/off text, CVA |
| `<app-button>` | `dx-button` | 5 types, icons |
| `<app-popup>` | `dx-popup` | Overlay, ESC, events |
| `<app-tab-panel>` | `dx-tab-panel` | Tab switching |
| `<app-accordion>` | `dx-accordion` | Expand/collapse |
| `<app-load-panel>` | `dx-load-panel` | Loading overlay |
| `thaiDate` pipe | — | วันที่ภาษาไทย พ.ศ. |

## การใช้งาน

```typescript
import { DatagridModule } from '@darkoum/ng-datagrid';

@Component({
  standalone: true,
  imports: [DatagridModule, FormsModule],
  template: `
    <app-datagrid [options]="gridOptions" />
  `
})
export class MyComponent {
  gridOptions: DataGridOptions = {
    keyExpr: 'id',
    dataSource: { load: (p) => this.api.getData(p) },
    columns: [
      { dataField: 'name',      caption: 'ชื่อ' },
      { dataField: 'orderDate', caption: 'วันที่', dataType: 'date', format: 'medium' },
      { dataField: 'total',     caption: 'ยอด',   dataType: 'number', format: '#,##0.00' },
    ],
    paging:  { enabled: true, pageSize: 20 },
    editing: { mode: 'popup', allowUpdating: true, allowDeleting: true },
  };
}
```

## Thai Date Formats

| Format | ตัวอย่างผลลัพธ์ |
|--------|--------------|
| `short` | 25 ม.ค. 68 |
| `mediumDate` | 25 ม.ค. 2568 |
| `medium` | 25 มกราคม 2568 |
| `long` | วันศุกร์ที่ 25 มกราคม พ.ศ. 2568 |
| `shortDate` | 25/01/2568 |
| `shortDateTime` | 25 ม.ค. 68 10:30 |
| `mediumDateTime` | 25 ม.ค. 2568 10:30:00 |
| `timeOnly` | 10:30:00 |

## ดูเพิ่มเติม

- [Changelog](./CHANGELOG.md)
- [Documentation](http://localhost:4300) — รัน `npx serve docs -p 4300`
