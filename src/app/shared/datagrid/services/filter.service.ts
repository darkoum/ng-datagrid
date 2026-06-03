import { Injectable } from '@angular/core';
import { FilterDescriptor } from '../models/datagrid.types';

@Injectable({ providedIn: 'root' })
export class FilterService {
  filterData<T>(data: T[], filters: FilterDescriptor[], search: string, searchFields: string[]): T[] {
    let result = filters.reduce((acc, f) =>
      acc.filter(row => this.match(row, f)), data);

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(row =>
        searchFields.some(f => String(this.get(row, f) ?? '').toLowerCase().includes(q))
      );
    }
    return result;
  }

  private match(row: any, f: FilterDescriptor): boolean {
    const v  = this.get(row, f.field);
    const sv = String(v ?? '').toLowerCase();
    const sc = String(f.value ?? '').toLowerCase();
    switch (f.operator) {
      case 'contains':   return sv.includes(sc);
      case 'startswith': return sv.startsWith(sc);
      case 'endswith':   return sv.endsWith(sc);
      case '=':          return v == f.value;
      case '!=':         return v != f.value;
      case '>':          return v  > f.value;
      case '>=':         return v >= f.value;
      case '<':          return v  < f.value;
      case '<=':         return v <= f.value;
      default:           return true;
    }
  }

  private get(obj: any, path: string): any {
    return path.split('.').reduce((o, k) => o?.[k], obj);
  }
}
