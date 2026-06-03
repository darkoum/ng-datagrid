import { Injectable } from '@angular/core';
import { SortDescriptor } from '../models/datagrid.types';

@Injectable({ providedIn: 'root' })
export class SortService {
  sortData<T>(data: T[], sorts: SortDescriptor[]): T[] {
    if (!sorts.length) return data;
    return [...data].sort((a, b) => {
      for (const s of sorts) {
        const av = this.get(a, s.selector);
        const bv = this.get(b, s.selector);
        const c  = this.cmp(av, bv);
        if (c !== 0) return s.desc ? -c : c;
      }
      return 0;
    });
  }

  private cmp(a: any, b: any): number {
    if (a == null && b == null) return 0;
    if (a == null) return -1;
    if (b == null) return  1;
    if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
    if (typeof a === 'string' && typeof b === 'string')
      return a.localeCompare(b, 'th', { sensitivity: 'base' });
    return a < b ? -1 : a > b ? 1 : 0;
  }

  private get(obj: any, path: string): any {
    return path.split('.').reduce((o, k) => o?.[k], obj);
  }
}
