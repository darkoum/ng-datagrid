import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatagridComponent, DataGridOptions } from '@darkoum/ng-datagrid';

interface Country {
  countryid: number;
  countrycode: string;
  countryname: string;
  countrynameeng: string;
}

@Component({
  selector: 'app-country-master',
  standalone: true,
  imports: [CommonModule, DatagridComponent],
  templateUrl: './country-master.component.html',
  styleUrl: './country-master.component.scss',
})
export class CountryMasterComponent {

  private _data = signal<Country[]>([
    { countryid: 1,  countrycode: 'TH', countryname: 'ไทย',          countrynameeng: 'Thailand' },
    { countryid: 2,  countrycode: 'JP', countryname: 'ญี่ปุ่น',       countrynameeng: 'Japan' },
    { countryid: 3,  countrycode: 'CN', countryname: 'จีน',           countrynameeng: 'China' },
    { countryid: 4,  countrycode: 'US', countryname: 'สหรัฐอเมริกา', countrynameeng: 'United States' },
    { countryid: 5,  countrycode: 'GB', countryname: 'อังกฤษ',        countrynameeng: 'United Kingdom' },
    { countryid: 6,  countrycode: 'DE', countryname: 'เยอรมนี',       countrynameeng: 'Germany' },
    { countryid: 7,  countrycode: 'FR', countryname: 'ฝรั่งเศส',      countrynameeng: 'France' },
    { countryid: 8,  countrycode: 'AU', countryname: 'ออสเตรเลีย',    countrynameeng: 'Australia' },
    { countryid: 9,  countrycode: 'KR', countryname: 'เกาหลีใต้',     countrynameeng: 'South Korea' },
    { countryid: 10, countrycode: 'SG', countryname: 'สิงคโปร์',      countrynameeng: 'Singapore' },
    { countryid: 11, countrycode: 'MY', countryname: 'มาเลเซีย',      countrynameeng: 'Malaysia' },
    { countryid: 12, countrycode: 'IN', countryname: 'อินเดีย',       countrynameeng: 'India' },
    { countryid: 13, countrycode: 'VN', countryname: 'เวียดนาม',      countrynameeng: 'Vietnam' },
    { countryid: 14, countrycode: 'PH', countryname: 'ฟิลิปปินส์',   countrynameeng: 'Philippines' },
    { countryid: 15, countrycode: 'ID', countryname: 'อินโดนีเซีย',   countrynameeng: 'Indonesia' },
  ]);

  private _nextId = 16;

  gridOptions: DataGridOptions<Country> = {
    keyExpr: 'countryid',
    dataSource: { store: this._data() },
    columns: [
      {
        dataField: 'countryid',
        caption: 'รหัส',
        width: 80,
        allowEditing: false,
      },
      {
        dataField: 'countrycode',
        caption: 'ตัวย่อ',
        width: 90,
      },
      {
        dataField: 'countryname',
        caption: 'ชื่อประเทศ (ไทย)',
      },
      {
        dataField: 'countrynameeng',
        caption: 'ชื่อประเทศ (อังกฤษ)',
      },
    ],
    paging: { enabled: true, pageSize: 15 },
    pager: { showPageSizeSelector: true, allowedPageSizes: [10, 15, 20, 0] },
    showBorders: true,
    rowAlternationEnabled: true,
    hoverStateEnabled: true,
    searchPanel: { visible: true, width: 240, placeholder: 'ค้นหา...' },
    editing: {
      mode: 'row',
      allowAdding: true,
      allowUpdating: true,
      allowDeleting: true,
      useIcons: true,
      confirmDelete: true,
      texts: {
        addRow: 'เพิ่มข้อมูล',
        saveRowChanges: 'บันทึก',
        cancelRowChanges: 'ยกเลิก',
        deleteRow: 'ลบ',
        confirmDeleteMessage: 'ยืนยันการลบรายการนี้?',
      },
    },
    onRowInserted: (e) => this.onInserted(e.data),
    onRowUpdated: (e) => this.onUpdated(e.data, e.key),
    onRowRemoved: (e) => this.onRemoved(e.key),
    export: { enabled: true, formats: ['xlsx'], fileName: 'country-master' },
  };

  lastAction = signal<string>('');

  private onInserted(data: Country) {
    const newRow: Country = { ...data, countryid: this._nextId++ };
    this._data.update(d => [...d, newRow]);
    this.lastAction.set(`✅ เพิ่ม: ${newRow.countryname} (${newRow.countrycode})`);
    this.rebuildGrid();
  }

  private onUpdated(data: Partial<Country>, key: number) {
    this._data.update(d => d.map(r => r.countryid === key ? { ...r, ...data } : r));
    this.lastAction.set(`✏️ แก้ไข ID ${key}: ${data.countryname ?? ''}`);
    this.rebuildGrid();
  }

  private onRemoved(key: number) {
    this._data.update(d => d.filter(r => r.countryid !== key));
    this.lastAction.set(`🗑️ ลบ ID ${key}`);
    this.rebuildGrid();
  }

  private rebuildGrid() {
    this.gridOptions = {
      ...this.gridOptions,
      dataSource: { store: this._data() },
    };
  }
}
