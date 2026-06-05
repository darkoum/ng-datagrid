import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideDatagridDefaults } from '@darkoum/ng-datagrid';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimationsAsync(),

    // ─── Global DataGrid defaults (เทียบเท่า dxDataGrid.defaultOptions) ───────
    // ตั้งค่าครั้งเดียวที่นี่ — ทุก <app-datagrid> ในทุกหน้าได้อัตโนมัติ
    // แต่ละหน้ายังสามารถ override ได้ผ่าน [options] ตามปกติ
    provideDatagridDefaults({
      showBorders:          true,
      rowAlternationEnabled: true,
      hoverStateEnabled:    true,
      allowColumnResizing:  true,
      columnMinWidth:       50,
      paging:  { enabled: true, pageSize: 15 },
      pager:   { showPageSizeSelector: true, allowedPageSizes: [15, 20, 30, 0], showInfo: true },
      selection: { mode: 'single' },
      editing:   { popup: { showTitle: true } },
    }),
  ],
};
