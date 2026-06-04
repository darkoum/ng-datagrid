import {
  Component, Input, Output, EventEmitter, OnInit, OnDestroy,
  ContentChildren, QueryList, Directive, TemplateRef,
  signal, computed, DestroyRef, inject, AfterContentInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { isObservable } from 'rxjs';
import { from } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  DataGridOptions, GridColumn, LoadResult,
  RowClickEvent, SelectionChangedEvent, RowChangeEvent,
  SavingEvent, SavedEvent, FormItem,
} from '../../models/datagrid.types';
import { DatagridStateService } from '../../services/datagrid-state.service';
import { SortService } from '../../services/sort.service';
import { FilterService } from '../../services/filter.service';
import { ExportService } from '../../services/export.service';
import { VirtualScrollService } from '../../services/virtual-scroll.service';
import { ThaiDatePipe } from '../../pipes/thai-date.pipe';
import { ResizableColumnDirective } from '../../directives/resizable-column.directive';
import { ThaiDatepickerComponent } from '../thai-datepicker/thai-datepicker.component';

@Directive({ selector: '[gridCellTemplate]', standalone: true })
export class GridCellTemplateDirective {
  @Input('gridCellTemplate') name!: string;
  constructor(public templateRef: TemplateRef<any>) {}
}

@Directive({ selector: '[gridDetailTemplate]', standalone: true })
export class GridDetailTemplateDirective {
  constructor(public templateRef: TemplateRef<any>) {}
}

type NormalizedColumn<T> = GridColumn<T> & { _field: string };

@Component({
  selector: 'app-datagrid',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,

    ResizableColumnDirective,
    ThaiDatepickerComponent,
  ],
  templateUrl: './datagrid.component.html',
  styleUrls: ['./datagrid.component.scss'],
  providers: [DatagridStateService, VirtualScrollService],
})
export class DatagridComponent<T = any> implements OnInit, AfterContentInit, OnDestroy {
  private _initialized = false;
  @Input() set options(val: DataGridOptions<T>) {
    this._options.set(val ?? {});
    if (this._initialized) {
      this.state.currentPage.set(1);  // reset pagination when data changes
      this.loadData();
    }
  }

  @Output() rowClick         = new EventEmitter<RowClickEvent<T>>();
  @Output() rowDblClick      = new EventEmitter<RowClickEvent<T>>();
  @Output() selectionChanged = new EventEmitter<SelectionChangedEvent<T>>();
  @Output() rowInserted      = new EventEmitter<RowChangeEvent<T>>();
  @Output() rowUpdated       = new EventEmitter<RowChangeEvent<T>>();
  @Output() rowRemoved       = new EventEmitter<RowChangeEvent<T>>();
  @Output() saving           = new EventEmitter<SavingEvent<T>>();
  @Output() saved            = new EventEmitter<SavedEvent<T>>();
  @Output() contentReady     = new EventEmitter<any>();

  @ContentChildren(GridCellTemplateDirective)
  cellTemplates!: QueryList<GridCellTemplateDirective>;

  @ContentChildren(GridDetailTemplateDirective)
  detailTemplates!: QueryList<GridDetailTemplateDirective>;

  readonly state      = inject(DatagridStateService<T>);
  private sortSvc     = inject(SortService);
  private filtSvc     = inject(FilterService);
  private expSvc      = inject(ExportService);
  private virtSvc     = inject(VirtualScrollService);
  private destroyRef  = inject(DestroyRef);

  private _options  = signal<DataGridOptions<T>>({});
  readonly opts     = computed(() => this._options());

  readonly columns = computed<NormalizedColumn<T>[]>(() =>
    (this.opts().columns ?? [])
      .filter(c => c.visible !== false)
      .map(c => ({ ...c, _field: ((c.field || c.dataField || '') as string) }))
  );

  readonly pageNumbers = computed<(number | '...')[]>(() => {
    const total = this.state.totalPages();
    const cur   = this.state.currentPage();
    const pages: (number | '...')[] = [];
    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      if (cur > 3) pages.push('...');
      for (let i = Math.max(2, cur - 1); i <= Math.min(total - 1, cur + 1); i++) pages.push(i);
      if (cur < total - 2) pages.push('...');
      pages.push(total);
    }
    return pages;
  });

  readonly allowedPageSizes = computed(() =>
    this.opts().pager?.allowedPageSizes ?? [10, 20, 50, 100]
  );

  readonly colSpanTotal = computed(() =>
    this.columns().length +
    (this.opts().masterDetail?.enabled ? 1 : 0) +
    (this.opts().selection?.mode === 'multiple' ? 1 : 0) +
    (this.opts().editing?.allowUpdating || this.opts().editing?.allowDeleting ? 1 : 0)
  );

  /** คอลัมน์ที่แสดงใน popup form (allowEditing !== false) */
  readonly editableColumns = computed<NormalizedColumn<T>[]>(() =>
    this.columns().filter(c => c.allowEditing !== false)
  );

  /** true เมื่อ editing mode = 'popup' */
  readonly isPopupMode = computed(() => this.opts().editing?.mode === 'popup');

  virtualRows        = signal<T[]>([]);
  editRowKey         = signal<any>(null);
  editRowData        = signal<Partial<T>>({});
  deleteConfirmRow   = signal<T | null>(null);
  /** popup mode signals */
  popupVisible       = signal(false);
  popupMode          = signal<'add' | 'edit'>('edit');
  activeTabIndex     = signal(0);
  filterValues: Record<string, string> = {};

  templateMap:    Record<string, TemplateRef<any>> = {};
  detailTemplate: TemplateRef<any> | null = null;

  ngOnInit(): void {
    const vsc = this.opts().virtualScrollConfig ?? {};
    this.virtSvc.configure({
      itemHeight:      vsc.itemHeight      ?? 40,
      bufferSize:      vsc.bufferSize      ?? 5,
      containerHeight: 400,
    });
    const ps = this.opts().paging?.pageSize;
    if (ps) this.state.pageSize.set(ps);
    this.loadData();
    this._initialized = true;
  }

  ngAfterContentInit(): void {
    this.cellTemplates.forEach(d => { this.templateMap[d.name] = d.templateRef; });
    this.detailTemplate = this.detailTemplates.first?.templateRef ?? null;
  }

  ngOnDestroy(): void {}

  // ─── Data Loading ─────────────────────────────────────────────────────────
  loadData(): void {
    const o  = this.opts();
    const ds = o.dataSource;
    this.state.loading.set(true);
    this.state.error.set(null);

    if (!ds) {
      this.state.rows.set([]);
      this.state.totalCount.set(0);
      this.state.loading.set(false);
      return;
    }

    if (Array.isArray(ds)) { this.processLocal(ds); return; }
    if (ds.store)          { this.processLocal(ds.store!); return; }

    if (ds.load) {
      const result = ds.load(this.state.loadParams());
      const obs    = isObservable(result) ? result : from(result as Promise<LoadResult<T>>);
      obs.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (r) => {
          this.state.rows.set(r.data);
          this.state.totalCount.set(r.totalCount);
          this.state.loading.set(false);
          this.syncVirtual(r.data);
          this.contentReady.emit({});
        },
        error: (err) => {
          this.state.error.set(String(err));
          this.state.loading.set(false);
        },
      });
    }
  }

  private processLocal(data: T[]): void {
    const o            = this.opts();
    const searchFields = (o.columns ?? []).map(c => (c.field || c.dataField || '') as string).filter(Boolean);
    let processed      = this.filtSvc.filterData(data, this.state.filters(), this.state.searchText(), searchFields);
    processed          = this.sortSvc.sortData(processed, this.state.sorts());
    this.state.totalCount.set(processed.length);

    const { skip } = this.state.loadParams();
    const take     = this.state.pageSize();
    const pageData = o.paging?.enabled !== false
      ? processed.slice(skip, skip + take)
      : processed;

    this.state.rows.set(pageData);
    this.state.loading.set(false);
    this.syncVirtual(pageData);
    this.contentReady.emit({});
  }

  private syncVirtual(rows: T[]): void {
    this.virtSvc.totalItems.set(rows.length);
    this.virtualRows.set(
      this.opts().scrolling?.mode === 'virtual'
        ? this.virtSvc.getVisibleItems(rows)
        : rows
    );
  }

  // ─── Sorting ──────────────────────────────────────────────────────────────
  onSort(col: NormalizedColumn<T>): void {
    if (col.allowSorting === false) return;
    this.state.toggleSort(col._field, this.opts().sorting?.mode === 'multiple');
    this.loadData();
  }

  getSortDir(field: string): 'asc' | 'desc' | null {
    const s = this.state.sorts().find(x => x.selector === field);
    return s ? (s.desc ? 'desc' : 'asc') : null;
  }

  getSortIndex(field: string): number {
    return this.state.sorts().findIndex(x => x.selector === field) + 1;
  }

  // ─── Filtering ────────────────────────────────────────────────────────────
  onFilterChange(field: string, value: string): void {
    this.filterValues[field] = value;
    this.state.setFilter(field, 'contains', value);
    this.loadData();
  }

  onSearch(text: string): void {
    this.state.setSearch(text);
    this.loadData();
  }

  // ─── Pagination ───────────────────────────────────────────────────────────
  goToPage(page: number | '...'): void {
    if (page === '...') return;
    this.state.setPage(page);
    this.loadData();
  }

  onPageSizeChange(size: number): void {
    this.state.setPageSize(size);
    this.loadData();
  }

  getPagerInfo(): string {
    const skip  = this.state.loadParams().skip;
    const total = this.state.totalCount();
    const from  = total === 0 ? 0 : skip + 1;
    const to    = Math.min(skip + this.state.pageSize(), total);
    return `แสดง ${from.toLocaleString()}-${to.toLocaleString()} จาก ${total.toLocaleString()} รายการ`;
  }

  // ─── Selection ────────────────────────────────────────────────────────────
  onRowSelect(row: T): void {
    const mode = this.opts().selection?.mode ?? 'none';
    if (mode === 'none') return;
    const key     = this.getKey(row);
    const prevKeys = [...this.state.selectedKeys()];
    this.state.selectRow(key, row, mode);
    this.selectionChanged.emit({
      selectedRowsData:         this.state.selectedRows(),
      selectedRowKeys:          this.state.selectedKeys(),
      currentSelectedRowKeys:   this.state.selectedKeys().filter(k => !prevKeys.includes(k)),
      currentDeselectedRowKeys: prevKeys.filter(k => !this.state.selectedKeys().includes(k)),
    });
    this.opts().onSelectionChanged?.({
      selectedRowsData:         this.state.selectedRows(),
      selectedRowKeys:          this.state.selectedKeys(),
      currentSelectedRowKeys:   this.state.selectedKeys().filter(k => !prevKeys.includes(k)),
      currentDeselectedRowKeys: prevKeys.filter(k => !this.state.selectedKeys().includes(k)),
    });
  }

  onSelectAll(checked: boolean): void {
    if (checked) this.state.selectAll(this.state.rows(), this.opts().keyExpr ?? 'id');
    else         this.state.clearSelection();
    this.selectionChanged.emit({
      selectedRowsData: this.state.selectedRows(),
      selectedRowKeys:  this.state.selectedKeys(),
      currentSelectedRowKeys: [],
      currentDeselectedRowKeys: [],
    });
  }

  isRowSelected(row: T): boolean {
    return this.state.selectedKeys().includes(this.getKey(row));
  }

  // ─── Row Click ────────────────────────────────────────────────────────────
  onRowClick(row: T, rowIndex: number, event: MouseEvent): void {
    this.opts().onRowClick?.({ data: row, rowIndex, event });
    this.rowClick.emit({ data: row, rowIndex, event });
    this.onRowSelect(row);
  }

  onRowDblClick(row: T, rowIndex: number, event: MouseEvent): void {
    this.opts().onRowDblClick?.({ data: row, rowIndex, event });
    this.rowDblClick.emit({ data: row, rowIndex, event });
  }

  // ─── Master Detail ────────────────────────────────────────────────────────
  toggleDetail(row: T): void { this.state.toggleExpand(this.getKey(row)); }
  isExpanded(row: T):   boolean { return this.state.expandedKeys().has(this.getKey(row)); }

  // ─── Editing ──────────────────────────────────────────────────────────────
  startEdit(row: T): void {
    this.editRowKey.set(this.getKey(row));
    this.editRowData.set({ ...row });
    if (this.isPopupMode()) {
      this.popupMode.set('edit');
      this.activeTabIndex.set(0);
      this.popupVisible.set(true);
    }
  }

  cancelEdit(): void {
    this.editRowKey.set(null);
    this.editRowData.set({});
    this.popupVisible.set(false);
  }

  /** บันทึกจาก popup (ทั้ง add และ edit) */
  async savePopup(): Promise<void> {
    if (this.popupMode() === 'add') {
      await this._doInsertPopup();
    } else {
      await this.saveEdit();
    }
  }

  /** สำหรับใช้ทั้ง inline (ส่ง row) และ popup (ไม่ส่ง row) */
  async saveEdit(row?: T): Promise<void> {
    const key     = row ? this.getKey(row) : this.editRowKey()!;
    const changes = this.editRowData();
    const o       = this.opts();

    const savingEv: SavingEvent<T> = {
      changes: [{ type: 'update', key, data: changes }],
      cancel:  false,
    };
    o.onSaving?.(savingEv);
    this.saving.emit(savingEv);
    if (savingEv.cancel) return;

    const ds = o.dataSource;
    if (ds && !Array.isArray(ds) && ds.update) {
      try {
        const result = ds.update(key, changes);
        if (isObservable(result)) {
          result.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.afterEdit('update', key, changes as T));
        } else {
          await (result as Promise<T>);
          this.afterEdit('update', key, changes as T);
        }
      } catch (e) { this.state.error.set(String(e)); }
    } else {
      this.state.rows.set(this.state.rows().map(r => this.getKey(r) === key ? { ...r, ...changes } : r));
      this.afterEdit('update', key, changes as T);
    }
  }

  private afterEdit(type: 'update' | 'insert' | 'remove', key: any, data: T): void {
    this.editRowKey.set(null);
    this.editRowData.set({});
    this.popupVisible.set(false);
    const ev: RowChangeEvent<T> = { data, key };
    const savedEv: SavedEvent<T> = { changes: [{ type, key, data }] };

    if      (type === 'update') { this.opts().onRowUpdated?.(ev); this.rowUpdated.emit(ev); }
    else if (type === 'insert') { this.opts().onRowInserted?.(ev); this.rowInserted.emit(ev); }
    else                        { this.opts().onRowRemoved?.(ev); this.rowRemoved.emit(ev); }

    this.opts().onSaved?.(savedEv);
    this.saved.emit(savedEv);
    this.loadData();
  }

  confirmDelete(row: T): void {
    if (this.opts().editing?.confirmDelete !== false) {
      this.deleteConfirmRow.set(row);
    } else {
      this.executeDelete(row);
    }
  }

  cancelDelete(): void { this.deleteConfirmRow.set(null); }

  async executeDelete(row: T): Promise<void> {
    const key = this.getKey(row);
    this.deleteConfirmRow.set(null);
    const ds = this.opts().dataSource;

    if (ds && !Array.isArray(ds) && ds.remove) {
      try {
        const result = ds.remove(key);
        if (isObservable(result)) {
          result.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.afterEdit('remove', key, row));
        } else {
          await (result as Promise<void>);
          this.afterEdit('remove', key, row);
        }
      } catch (e) { this.state.error.set(String(e)); }
    } else {
      this.state.rows.set(this.state.rows().filter(r => this.getKey(r) !== key));
      this.afterEdit('remove', key, row);
    }
  }

  async addRow(): Promise<void> {
    if (this.isPopupMode()) {
      // popup mode → เปิด form เปล่า ให้ user กรอกก่อน
      this.editRowData.set({} as Partial<T>);
      this.editRowKey.set('__new__' as any);
      this.popupMode.set('add');
      this.activeTabIndex.set(0);
      this.popupVisible.set(true);
      return;
    }

    // row mode (เดิม) — insert ทันที
    const o     = this.opts();
    const empty = {} as T;
    const ds    = o.dataSource;

    if (ds && !Array.isArray(ds) && ds.insert) {
      try {
        const result = ds.insert(empty);
        if (isObservable(result)) {
          result.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(r => this.afterEdit('insert', this.getKey(r), r));
        } else {
          const r = await (result as Promise<T>);
          this.afterEdit('insert', this.getKey(r), r);
        }
      } catch (e) { this.state.error.set(String(e)); }
    } else {
      this.loadData();
    }
  }

  /** Insert จาก popup form */
  private async _doInsertPopup(): Promise<void> {
    const changes = this.editRowData();
    const o       = this.opts();

    const savingEv: SavingEvent<T> = {
      changes: [{ type: 'insert', data: changes }],
      cancel:  false,
    };
    o.onSaving?.(savingEv);
    this.saving.emit(savingEv);
    if (savingEv.cancel) return;

    const ds = o.dataSource;
    if (ds && !Array.isArray(ds) && ds.insert) {
      try {
        const result = ds.insert(changes);
        if (isObservable(result)) {
          result.pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(r => this.afterEdit('insert', this.getKey(r), r));
        } else {
          const r = await (result as Promise<T>);
          this.afterEdit('insert', this.getKey(r), r);
        }
      } catch (e) { this.state.error.set(String(e)); }
    } else {
      // local store หรือ static array — append แล้ว reload
      this.afterEdit('insert', null, changes as T);
    }
  }

  // ─── Column Resize ────────────────────────────────────────────────────────
  onColumnWidthChanged(e: { field: string; width: number }): void {
    this.state.setColumnWidth(e.field, e.width);
  }

  getColumnStyle(col: NormalizedColumn<T>): Record<string, string> {
    const stored = this.state.columnWidths()[col._field];
    const w = stored ? `${stored}px`
            : col.width ? (typeof col.width === 'number' ? `${col.width}px` : col.width)
            : '';
    return w ? { width: w, 'min-width': w } : {};
  }

  // ─── Cell Value ───────────────────────────────────────────────────────────
  getCellValue(row: T, col: NormalizedColumn<T>): any {
    if (col.calculateCellValue) return col.calculateCellValue(row);
    return col._field.split('.').reduce((o: any, k) => o?.[k], row);
  }

  formatCellValue(row: T, col: NormalizedColumn<T>): string {
    const val = this.getCellValue(row, col);
    if (val == null || val === '') return '';

    if (col.lookup) {
      const found = col.lookup.dataSource.find(d => d[col.lookup!.valueExpr] === val);
      return found ? found[col.lookup!.displayExpr] : String(val);
    }

    if (col.calculateDisplayValue) return col.calculateDisplayValue(row);

    const thaiDate = this.opts().thaiDate;
    const thaiDateFormat = this.opts().thaiDateFormat ?? 'medium';

    if (col.dataType === 'date' || col.dataType === 'datetime') {
      const fmt = col.format ?? (thaiDate ? thaiDateFormat : 'medium');
      const pipe = new ThaiDatePipe();
      return pipe.transform(val, fmt as any);
    }

    if (col.dataType === 'number') {
      const n = Number(val);
      if (col.format === '#,##0.00') return n.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      if (col.format === '#,##0')    return n.toLocaleString('th-TH');
    }

    if (col.dataType === 'boolean') return val ? 'ใช่' : 'ไม่ใช่';

    return String(val);
  }

  // ─── Virtual Scroll ───────────────────────────────────────────────────────
  readonly virtualContainerHeight = 400;

  get virtualOffsetY(): number { return this.virtSvc.offsetY(); }

  get virtualTotalHeight(): number { return this.virtSvc.totalHeight(); }

  get virtualBottomSpacer(): number {
    const { startIdx, endIdx } = this.virtSvc.visibleRange();
    const ih   = this.virtSvc.config.itemHeight;
    const used = this.virtSvc.offsetY() + (endIdx - startIdx + 1) * ih;
    return Math.max(0, this.virtSvc.totalHeight() - used);
  }

  onVirtualScroll(event: Event): void {
    this.virtSvc.onScroll((event.target as HTMLElement).scrollTop);
    this.virtualRows.set(this.virtSvc.getVisibleItems(this.state.rows()));
  }

  // ─── Export ───────────────────────────────────────────────────────────────
  exportData(format: 'csv' | 'xlsx' = 'csv'): void {
    const o        = this.opts();
    const fileName = o.export?.fileName ?? 'export';
    const data     = this.state.selectedKeys().length > 0
      ? this.state.selectedRows()
      : this.state.rows();

    if (format === 'xlsx') this.expSvc.exportXlsx(data, this.columns(), fileName);
    else                   this.expSvc.exportCsv(data, this.columns(), fileName);
  }

  // ─── Toolbar helpers ─────────────────────────────────────────────────────
  showToolbar(): boolean {
    if (this.opts().toolbar?.visible === false) return false;
    return this.showAddButton() || this.showExportButton() || this.showSearchPanel() || this.getCustomItems().length > 0;
  }

  showAddButton():    boolean { return this.toolbarHas('addRowButton')  || (this.opts().editing?.allowAdding ?? false); }
  showExportButton(): boolean { return this.toolbarHas('exportButton')  || (this.opts().export?.enabled ?? false); }
  showSearchPanel():  boolean { return this.toolbarHas('searchPanel')   || (this.opts().searchPanel?.visible ?? false); }
  showCheckboxes():   boolean {
    const m = this.opts().selection?.showCheckBoxesMode ?? 'onClick';
    return m === 'always' || this.opts().selection?.mode === 'multiple';
  }

  getCustomItems(): any[] {
    return (this.opts().toolbar?.items ?? []).filter(
      (i): i is { widget: 'dxButton'; options: any } => typeof i === 'object' && 'widget' in i
    );
  }

  private toolbarHas(name: string): boolean {
    return (this.opts().toolbar?.items ?? []).includes(name as any);
  }

  // ─── Public API ───────────────────────────────────────────────────────────
  refresh(): void                { this.loadData(); }
  clearFilter(): void            { this.filterValues = {}; this.state.clearFilters(); this.loadData(); }
  getSelectedRowsData(): T[]     { return this.state.selectedRows(); }

  // ─── Helpers ──────────────────────────────────────────────────────────────
  isEditing(row: T): boolean {
    // popup mode → ไม่มี inline edit ใน row เลย
    if (this.isPopupMode()) return false;
    return this.editRowKey() === this.getKey(row);
  }
  isDeleteConfirming(row: T): boolean { return this.deleteConfirmRow() !== null && this.getKey(this.deleteConfirmRow()!) === this.getKey(row); }

  /** ประเภท input สำหรับ auto-column popup (ใช้ 'dx*' naming) */
  getPopupInputType(col: NormalizedColumn<T>): string {
    if (col.editCellTemplate && this.templateMap[col.editCellTemplate]) return 'custom';
    if (col.dataType === 'date' || col.dataType === 'datetime')          return 'dxDateBox';
    if (col.lookup)                                                       return 'dxSelectBox';
    if (col.dataType === 'boolean')                                       return 'dxCheckBox';
    if (col.dataType === 'number')                                        return 'dxNumberBox';
    return 'dxTextBox';
  }

  // ── FormItem helpers (DevExtreme-like form config) ─────────────────────────

  /** จำนวนคอลัมน์ของ popup form */
  getPopupColCount(): 1 | 2 {
    return (this.opts().editing?.form?.colCount ?? 2) as 1 | 2;
  }

  /** label text ของ FormItem — ใช้ label.text หรือ column.caption */
  getFormItemLabel(item: FormItem): string {
    if (item.label?.text) return item.label.text;
    const col = this.columns().find(c => c._field === item.dataField);
    return col?.caption ?? item.dataField ?? '';
  }

  /** editor type ของ FormItem — ใช้ item.editorType หรือ infer จาก column.dataType */
  getFormItemEditorType(item: FormItem): string {
    if (item.editorType) return item.editorType;
    const col = this.columns().find(c => c._field === item.dataField);
    if (!col) return 'dxTextBox';
    if (col.dataType === 'date' || col.dataType === 'datetime') return 'dxDateBox';
    if (col.lookup)                                             return 'dxSelectBox';
    if (col.dataType === 'boolean')                             return 'dxCheckBox';
    if (col.dataType === 'number')                              return 'dxNumberBox';
    return 'dxTextBox';
  }

  /** dataSource สำหรับ dxSelectBox — จาก editorOptions หรือ column.lookup */
  getFormItemDataSource(item: FormItem): any[] {
    return item.editorOptions?.['dataSource'] ??
           this.columns().find(c => c._field === item.dataField)?.lookup?.dataSource ?? [];
  }

  /** valueExpr สำหรับ dxSelectBox */
  getFormItemValueExpr(item: FormItem): string {
    return item.editorOptions?.['valueExpr'] ??
           this.columns().find(c => c._field === item.dataField)?.lookup?.valueExpr ?? 'value';
  }

  /** displayExpr สำหรับ dxSelectBox */
  getFormItemDisplayExpr(item: FormItem): string {
    return item.editorOptions?.['displayExpr'] ??
           this.columns().find(c => c._field === item.dataField)?.lookup?.displayExpr ?? 'label';
  }

  /** lock ปุ่มแก้ไข/ลบ ขณะที่มี row กำลัง edit หรือ popup กำลังเปิด */
  get isAnyEditing(): boolean {
    return this.editRowKey() !== null || this.popupVisible();
  }

  private getKey(row: T): any {
    return (row as any)[this.opts().keyExpr ?? 'id'];
  }

  // arrow function เพื่อ preserve `this` context เมื่อ Angular เรียก trackBy
  trackByKey = (_: number, row: T): any => this.getKey(row);

  // computed signal — Angular tracks signal reads อัตโนมัติ ไม่พลาด re-render
  readonly displayRows = computed<T[]>(() =>
    this.opts().scrolling?.mode === 'virtual' ? this.virtualRows() : this.state.rows()
  );
}
