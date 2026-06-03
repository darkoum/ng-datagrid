import { TemplateRef } from '@angular/core';
import { Observable } from 'rxjs';

export type ThaiDateFormat =
  | 'short'
  | 'mediumDate'
  | 'medium'
  | 'long'
  | 'shortDate'
  | 'shortDateTime'
  | 'mediumDateTime'
  | 'timeOnly'
  | string;

export interface GridColumn<T = any> {
  field?: keyof T | string;
  dataField?: string;
  caption: string;
  width?: number | string;
  minWidth?: number;
  visible?: boolean;
  allowSorting?: boolean;
  allowFiltering?: boolean;
  allowResizing?: boolean;
  allowReordering?: boolean;
  fixed?: boolean;
  fixedPosition?: 'left' | 'right';
  dataType?: 'string' | 'number' | 'date' | 'datetime' | 'boolean' | 'custom';
  format?: string | ThaiDateFormat;
  alignment?: 'left' | 'center' | 'right';
  allowEditing?: boolean;
  editCellTemplate?: string;
  cellTemplate?: string;
  headerCellTemplate?: string;
  calculateCellValue?: (rowData: T) => any;
  calculateDisplayValue?: (rowData: T) => string;
  lookup?: { dataSource: any[]; valueExpr: string; displayExpr: string; };
  cssClass?: string;
  encodeHtml?: boolean;
}

export interface PagingConfig {
  enabled: boolean;
  pageSize?: number;
  pageIndex?: number;
}

export interface PagerConfig {
  showPageSizeSelector?: boolean;
  allowedPageSizes?: number[];
  showInfo?: boolean;
  showNavigationButtons?: boolean;
}

export interface SelectionConfig {
  mode: 'none' | 'single' | 'multiple';
  selectAllMode?: 'page' | 'allPages';
  showCheckBoxesMode?: 'always' | 'onClick' | 'onLongTap' | 'none';
}

/**
 * FormItem — เหมือน DevExtreme dxForm items
 * รองรับ simple field, group, empty
 */
export interface FormItem {
  /** อ้างอิง column.dataField */
  dataField?: string;
  /** ป้ายชื่อ — ถ้าไม่ระบุใช้ column.caption อัตโนมัติ */
  label?: { text?: string; visible?: boolean };
  /**
   * editor type — ถ้าไม่ระบุ infer จาก column.dataType
   * 'dxTextBox' | 'dxNumberBox' | 'dxDateBox' | 'dxSelectBox' | 'dxCheckBox' | 'dxTextArea'
   */
  editorType?: string;
  /** ตัวเลือกพิเศษของ editor เช่น { dataSource, valueExpr, displayExpr, placeholder } */
  editorOptions?: Record<string, any>;
  /** 'simple' (default) | 'group' | 'empty' */
  itemType?: 'simple' | 'group' | 'empty';
  /** caption ของ group (ใช้เมื่อ itemType = 'group') */
  caption?: string;
  /** จำนวนคอลัมน์ภายใน group */
  colCount?: 1 | 2;
  /** ขยายกี่ column — 2 = เต็มแถว */
  colSpan?: 1 | 2;
  /** items ภายใน group */
  items?: FormItem[];
  visible?: boolean;
  isRequired?: boolean;
}

export interface EditingConfig {
  mode?: 'row' | 'cell' | 'batch' | 'popup';
  allowAdding?: boolean;
  allowUpdating?: boolean;
  allowDeleting?: boolean;
  useIcons?: boolean;
  confirmDelete?: boolean;
  /**
   * ตั้งค่า popup dialog (ใช้เมื่อ mode = 'popup')
   * เหมือน DevExtreme editing.popup
   */
  popup?: {
    title?: string;
    showTitle?: boolean;
    width?: number;
    height?: number;
  };
  /**
   * ตั้งค่า form layout (ใช้เมื่อ mode = 'popup')
   * เหมือน DevExtreme editing.form
   */
  form?: {
    /** จำนวนคอลัมน์ในฟอร์ม (default: 2) — ใช้เมื่อไม่ระบุ items */
    colCount?: 1 | 2;
    /** กำหนด layout แบบ custom — ถ้าไม่ระบุจะ auto-generate จาก columns */
    items?: FormItem[];
  };
  texts?: {
    saveRowChanges?: string;
    cancelRowChanges?: string;
    deleteRow?: string;
    confirmDeleteMessage?: string;
    addRow?: string;
  };
}

export interface MasterDetailConfig {
  enabled: boolean;
  template?: string;
}

export interface SortingConfig {
  mode?: 'none' | 'single' | 'multiple';
}

export interface SortDescriptor {
  selector: string;
  desc: boolean;
}

export interface FilterDescriptor {
  field: string;
  operator: 'contains' | 'startswith' | 'endswith' | '=' | '!=' | '>' | '>=' | '<' | '<=';
  value: any;
}

export interface ExportConfig {
  enabled?: boolean;
  formats?: ('xlsx' | 'pdf' | 'csv')[];
  fileName?: string;
  allowExportSelectedData?: boolean;
}

export interface LoadParams {
  skip: number;
  take: number;
  sort?: SortDescriptor[];
  filter?: FilterDescriptor[];
  searchValue?: string;
  searchOperation?: string;
  searchExpr?: string;
  requireTotalCount?: boolean;
  userData?: any;
}

export interface LoadResult<T = any> {
  data: T[];
  totalCount: number;
  summary?: any[];
}

export interface GridDataSource<T = any> {
  store?: T[];
  load?: (params: LoadParams) => Observable<LoadResult<T>> | Promise<LoadResult<T>>;
  insert?: (values: Partial<T>) => Observable<T> | Promise<T>;
  update?: (key: any, values: Partial<T>) => Observable<T> | Promise<T>;
  remove?: (key: any) => Observable<void> | Promise<void>;
  key?: string;
}

export type ToolbarItem =
  | 'addRowButton' | 'exportButton' | 'searchPanel' | 'columnChooserButton'
  | { widget: 'dxButton'; options: { text: string; icon?: string; onClick: () => void } }
  | { name: string; location?: 'before' | 'after' | 'center' };

export interface DataGridOptions<T = any> {
  dataSource?: GridDataSource<T> | T[];
  keyExpr?: string;
  columns?: GridColumn<T>[];
  columnAutoWidth?: boolean;
  columnMinWidth?: number;
  allowColumnResizing?: boolean;
  allowColumnReordering?: boolean;
  columnResizingMode?: 'nextColumn' | 'widget';
  paging?: PagingConfig;
  pager?: PagerConfig;
  scrolling?: { mode?: 'standard' | 'virtual' | 'infinite'; rowRenderingMode?: 'standard' | 'virtual' };
  selection?: SelectionConfig;
  editing?: EditingConfig;
  sorting?: SortingConfig;
  filterRow?: { visible?: boolean };
  searchPanel?: { visible?: boolean; width?: number; placeholder?: string };
  headerFilter?: { visible?: boolean };
  masterDetail?: MasterDetailConfig;
  export?: ExportConfig;
  toolbar?: { visible?: boolean; items?: ToolbarItem[] };
  showBorders?: boolean;
  showRowLines?: boolean;
  showColumnLines?: boolean;
  rowAlternationEnabled?: boolean;
  hoverStateEnabled?: boolean;
  noDataText?: string;
  loadingText?: string;
  thaiDate?: boolean;
  thaiDateFormat?: ThaiDateFormat;
  virtualScrollConfig?: { itemHeight?: number; bufferSize?: number };
  onRowClick?: (e: RowClickEvent<T>) => void;
  onRowDblClick?: (e: RowClickEvent<T>) => void;
  onSelectionChanged?: (e: SelectionChangedEvent<T>) => void;
  onRowInserted?: (e: RowChangeEvent<T>) => void;
  onRowUpdated?: (e: RowChangeEvent<T>) => void;
  onRowRemoved?: (e: RowChangeEvent<T>) => void;
  onSaving?: (e: SavingEvent<T>) => void;
  onSaved?: (e: SavedEvent<T>) => void;
  onContentReady?: (e: any) => void;
  onCellPrepared?: (e: CellPreparedEvent<T>) => void;
  onRowPrepared?: (e: RowPreparedEvent<T>) => void;
}

export interface RowClickEvent<T> {
  data: T; rowIndex: number; event: MouseEvent;
}
export interface SelectionChangedEvent<T> {
  selectedRowsData: T[]; selectedRowKeys: any[];
  currentSelectedRowKeys: any[]; currentDeselectedRowKeys: any[];
}
export interface RowChangeEvent<T> { data: T; key: any; }
export interface SavingEvent<T> {
  changes: Array<{ type: 'insert' | 'update' | 'remove'; data?: Partial<T>; key?: any }>;
  cancel: boolean;
}
export interface SavedEvent<T> {
  changes: Array<{ type: 'insert' | 'update' | 'remove'; data?: Partial<T>; key?: any }>;
}
export interface CellPreparedEvent<T> {
  rowType: 'header' | 'data' | 'detail' | 'totalFooter';
  data?: T; column: GridColumn<T>; value?: any;
  displayValue?: string; cellElement?: HTMLElement;
}
export interface RowPreparedEvent<T> {
  rowType: 'header' | 'data' | 'detail';
  data?: T; rowIndex: number; rowElement?: HTMLElement;
}
