import { Injectable } from '@angular/core';
import { GridColumn } from '../models/datagrid.types';

@Injectable({ providedIn: 'root' })
export class ExportService {
  exportCsv<T>(data: T[], columns: GridColumn<T>[], fileName = 'export'): void {
    const visibleCols = columns.filter(c => c.visible !== false);
    const headers = visibleCols.map(c => `"${c.caption}"`).join(',');
    const rows = data.map(row =>
      visibleCols.map(c => {
        const field = (c.field || c.dataField || '') as string;
        const val   = field ? this.getNestedValue(row, field) : '';
        return `"${String(val ?? '').replace(/"/g, '""')}"`;
      }).join(',')
    );
    // BOM (﻿) ทำให้ Excel เปิดภาษาไทยได้ถูกต้อง
    const csv = '﻿' + [headers, ...rows].join('\n');
    this.download(csv, `${fileName}.csv`, 'text/csv;charset=utf-8;');
  }

  async exportXlsx<T>(data: T[], columns: GridColumn<T>[], fileName = 'export'): Promise<void> {
    try {
      const XLSX = await import('xlsx');
      const visibleCols = columns.filter(c => c.visible !== false);
      const wsData = [
        visibleCols.map(c => c.caption),
        ...data.map(row =>
          visibleCols.map(c => {
            const field = (c.field || c.dataField || '') as string;
            return field ? this.getNestedValue(row, field) : '';
          })
        ),
      ];
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      XLSX.writeFile(wb, `${fileName}.xlsx`);
    } catch {
      console.error('xlsx package not installed. Run: npm install xlsx');
    }
  }

  private download(content: string, fileName: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((o, k) => o?.[k], obj);
  }
}
