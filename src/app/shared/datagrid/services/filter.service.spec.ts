import { FilterService } from './filter.service';

describe('FilterService', () => {
  let svc: FilterService;
  const data = [
    { id: 1, name: 'สมชาย ใจดี', age: 30 },
    { id: 2, name: 'สมหญิง รักไทย', age: 25 },
    { id: 3, name: 'กมล ศิลปะ', age: 35 },
  ];

  beforeEach(() => { svc = new FilterService(); });

  it('contains filter ภาษาไทย', () => {
    const r = svc.filterData(data, [{ field: 'name', operator: 'contains', value: 'สม' }], '', []);
    expect(r.length).toBe(2);
  });

  it('= filter', () => {
    const r = svc.filterData(data, [{ field: 'age', operator: '=', value: 30 }], '', []);
    expect(r[0].id).toBe(1);
  });

  it('>= filter', () => {
    const r = svc.filterData(data, [{ field: 'age', operator: '>=', value: 30 }], '', []);
    expect(r.length).toBe(2);
  });

  it('global search', () => {
    const r = svc.filterData(data, [], 'กมล', ['name']);
    expect(r.length).toBe(1);
    expect(r[0].id).toBe(3);
  });

  it('ไม่ match → array ว่าง', () => {
    const r = svc.filterData(data, [{ field: 'name', operator: 'contains', value: 'zzz' }], '', []);
    expect(r.length).toBe(0);
  });

  it('multiple filters AND logic', () => {
    const r = svc.filterData(data,
      [{ field: 'name', operator: 'contains', value: 'สม' },
       { field: 'age', operator: '>=', value: 28 }], '', []);
    expect(r.length).toBe(1);
    expect(r[0].id).toBe(1);
  });
});
