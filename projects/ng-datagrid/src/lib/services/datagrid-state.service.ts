import { Injectable, signal, computed } from '@angular/core';
import { SortDescriptor, FilterDescriptor, LoadParams } from '../models/datagrid.types';

@Injectable()
export class DatagridStateService<T = any> {
  readonly rows         = signal<T[]>([]);
  readonly totalCount   = signal(0);
  readonly loading      = signal(false);
  readonly currentPage  = signal(1);
  readonly pageSize     = signal(20);
  readonly sorts        = signal<SortDescriptor[]>([]);
  readonly filters      = signal<FilterDescriptor[]>([]);
  readonly searchText   = signal('');
  readonly selectedKeys = signal<any[]>([]);
  readonly selectedRows = signal<T[]>([]);
  readonly expandedKeys = signal<Set<any>>(new Set());
  readonly editingKey   = signal<any>(null);
  readonly columnWidths = signal<Record<string, number>>({});
  readonly editChanges  = signal<Map<any, Partial<T>>>(new Map());
  readonly error        = signal<string | null>(null);

  readonly loadParams = computed<LoadParams>(() => ({
    skip:              (this.currentPage() - 1) * this.pageSize(),
    take:              this.pageSize(),
    sort:              this.sorts(),
    filter:            this.filters(),
    searchValue:       this.searchText(),
    requireTotalCount: true,
  }));

  readonly totalPages = computed(() =>
    this.pageSize() > 0 ? Math.ceil(this.totalCount() / this.pageSize()) || 1 : 1
  );

  readonly hasChanges = computed(() => this.editChanges().size > 0);

  readonly isAllSelected = computed(() => {
    const rows = this.rows();
    return rows.length > 0 && this.selectedKeys().length === rows.length;
  });

  setPage(page: number): void {
    this.currentPage.set(Math.max(1, Math.min(page, this.totalPages())));
  }

  setPageSize(size: number): void {
    this.pageSize.set(size);
    this.currentPage.set(1);
  }

  toggleSort(field: string, multiSort: boolean): void {
    const cur = this.sorts();
    const ex  = cur.find(s => s.selector === field);

    if (multiSort) {
      if (!ex)           this.sorts.set([...cur, { selector: field, desc: false }]);
      else if (!ex.desc) this.sorts.set(cur.map(s => s.selector === field ? { ...s, desc: true } : s));
      else               this.sorts.set(cur.filter(s => s.selector !== field));
    } else {
      if (!ex)           this.sorts.set([{ selector: field, desc: false }]);
      else if (!ex.desc) this.sorts.set([{ selector: field, desc: true }]);
      else               this.sorts.set([]);
    }
    this.currentPage.set(1);
  }

  setFilter(field: string, operator: FilterDescriptor['operator'], value: any): void {
    const rest = this.filters().filter(f => f.field !== field);
    this.filters.set(value !== null && value !== '' && value !== undefined
      ? [...rest, { field, operator, value }]
      : rest
    );
    this.currentPage.set(1);
  }

  clearFilters(): void {
    this.filters.set([]);
    this.searchText.set('');
    this.currentPage.set(1);
  }

  setSearch(text: string): void {
    this.searchText.set(text);
    this.currentPage.set(1);
  }

  toggleExpand(key: any): void {
    const s = new Set(this.expandedKeys());
    s.has(key) ? s.delete(key) : s.add(key);
    this.expandedKeys.set(s);
  }

  selectRow(key: any, row: T, mode: 'single' | 'multiple'): void {
    if (mode === 'single') {
      this.selectedKeys.set([key]);
      this.selectedRows.set([row]);
    } else {
      const keys = this.selectedKeys();
      if (keys.includes(key)) {
        this.selectedKeys.set(keys.filter(k => k !== key));
        this.selectedRows.update(r => r.filter((_, i) => keys[i] !== key));
      } else {
        this.selectedKeys.update(k => [...k, key]);
        this.selectedRows.update(r => [...r, row]);
      }
    }
  }

  selectAll(rows: T[], keyField: string): void {
    this.selectedKeys.set(rows.map(r => (r as any)[keyField]));
    this.selectedRows.set([...rows]);
  }

  clearSelection(): void {
    this.selectedKeys.set([]);
    this.selectedRows.set([]);
  }

  setColumnWidth(field: string, width: number): void {
    this.columnWidths.update(w => ({ ...w, [field]: width }));
  }

  recordEdit(key: any, changes: Partial<T>): void {
    const m = new Map(this.editChanges());
    m.set(key, { ...(m.get(key) ?? {}), ...changes });
    this.editChanges.set(m);
  }

  clearEdits(): void {
    this.editChanges.set(new Map());
    this.editingKey.set(null);
  }

  reset(): void {
    this.currentPage.set(1);
    this.sorts.set([]);
    this.filters.set([]);
    this.searchText.set('');
    this.selectedKeys.set([]);
    this.selectedRows.set([]);
    this.expandedKeys.set(new Set());
    this.editingKey.set(null);
    this.editChanges.set(new Map());
    this.error.set(null);
  }
}
