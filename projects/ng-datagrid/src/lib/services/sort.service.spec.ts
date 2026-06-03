import { SortService } from './sort.service';

describe('SortService', () => {
  let svc: SortService;
  beforeEach(() => { svc = new SortService(); });

  const data = [
    { id: 3, name: 'สมชาย', date: new Date(2024, 0, 15) },
    { id: 1, name: 'อนันต์', date: new Date(2024, 5, 1) },
    { id: 2, name: 'กมล',   date: new Date(2024, 2, 20) },
  ];

  it('sort asc by id', () => {
    const r = svc.sortData(data, [{ selector: 'id', desc: false }]);
    expect(r.map(x => x.id)).toEqual([1, 2, 3]);
  });

  it('sort desc by id', () => {
    const r = svc.sortData(data, [{ selector: 'id', desc: true }]);
    expect(r.map(x => x.id)).toEqual([3, 2, 1]);
  });

  it('sort Thai string asc (locale)', () => {
    const r = svc.sortData(data, [{ selector: 'name', desc: false }]);
    expect(r[0].name).toBe('กมล');
  });

  it('sort by date asc', () => {
    const r = svc.sortData(data, [{ selector: 'date', desc: false }]);
    expect(r[0].id).toBe(3);
  });

  it('no sorts → same order', () => {
    const r = svc.sortData(data, []);
    expect(r).toEqual(data);
  });

  it('sort nested field', () => {
    const nested = [
      { info: { age: 30 } },
      { info: { age: 20 } },
      { info: { age: 25 } },
    ];
    const r = svc.sortData(nested, [{ selector: 'info.age', desc: false }]);
    expect(r[0].info.age).toBe(20);
  });
});
