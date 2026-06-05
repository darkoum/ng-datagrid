import { InjectionToken } from '@angular/core';
import { DataGridOptions } from './models/datagrid.types';

/**
 * InjectionToken สำหรับ global default options ของ DataGrid
 *
 * ตั้งค่าใน app.config.ts ครั้งเดียว — ทุก <app-datagrid> ในทุกหน้าจะได้ defaults นี้
 * Options ที่ระบุใน [options] ของแต่ละ instance จะ override defaults เสมอ
 */
export const DATAGRID_DEFAULT_OPTIONS =
  new InjectionToken<DataGridOptions>('DATAGRID_DEFAULT_OPTIONS');

/**
 * Helper สำหรับ app.config.ts — ใช้แทน dxDataGrid.defaultOptions() ของ DevExtreme
 *
 * @example
 * // app.config.ts
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideRouter(routes),
 *     provideHttpClient(),
 *     provideDatagridDefaults({
 *       showBorders: true,
 *       rowAlternationEnabled: true,
 *       hoverStateEnabled: true,
 *       allowColumnResizing: true,
 *       columnMinWidth: 50,
 *       paging:  { enabled: true, pageSize: 15 },
 *       pager:   { showPageSizeSelector: true, allowedPageSizes: [15, 20, 30, 0], showInfo: true },
 *       selection: { mode: 'single' },
 *       editing: { popup: { showTitle: true } },
 *     }),
 *   ],
 * };
 */
export function provideDatagridDefaults(options: DataGridOptions): any {
  return { provide: DATAGRID_DEFAULT_OPTIONS, useValue: options };
}
