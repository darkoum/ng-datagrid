import { TestBed } from '@angular/core/testing';
import { DatagridStateService } from './datagrid-state.service';

interface TestRow { id: number; name: string; }

describe('DatagridStateService', () => {
  let service: DatagridStateService<TestRow>;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [DatagridStateService] });
    service = TestBed.inject(DatagridStateService);
  });

  describe('Pagination', () => {
    it('setPageSize ต้อง reset กลับ page 1', () => {
      service.totalCount.set(100);
      service.setPage(3);
      service.setPageSize(50);
      expect(service.currentPage()).toBe(1);
      expect(service.pageSize()).toBe(50);
    });

    it('setPage ไม่ควรเกิน totalPages', () => {
      service.totalCount.set(40);
      service.pageSize.set(20);
      service.setPage(99);
      expect(service.currentPage()).toBe(2);
    });

    it('totalPages computed ถูกต้อง', () => {
      service.totalCount.set(45);
      service.pageSize.set(20);
      expect(service.totalPages()).toBe(3);
    });
  });

  describe('Sorting', () => {
    it('toggleSort ครั้งแรก → asc', () => {
      service.toggleSort('name', false);
      expect(service.sorts()).toEqual([{ selector: 'name', desc: false }]);
    });

    it('toggleSort ครั้งสอง → desc', () => {
      service.toggleSort('name', false);
      service.toggleSort('name', false);
      expect(service.sorts()[0].desc).toBe(true);
    });

    it('toggleSort ครั้งสาม → เคลียร์', () => {
      service.toggleSort('name', false);
      service.toggleSort('name', false);
      service.toggleSort('name', false);
      expect(service.sorts()).toEqual([]);
    });

    it('multiSort เพิ่ม column ได้หลายตัว', () => {
      service.toggleSort('name', true);
      service.toggleSort('id', true);
      expect(service.sorts().length).toBe(2);
    });
  });

  describe('Filtering', () => {
    it('setFilter เพิ่ม filter', () => {
      service.setFilter('name', 'contains', 'test');
      expect(service.filters().length).toBe(1);
    });

    it('setFilter ค่าว่าง ลบ filter', () => {
      service.setFilter('name', 'contains', 'test');
      service.setFilter('name', 'contains', '');
      expect(service.filters().length).toBe(0);
    });

    it('clearFilters ล้างทั้งหมด', () => {
      service.setFilter('name', 'contains', 'test');
      service.setSearch('abc');
      service.clearFilters();
      expect(service.filters().length).toBe(0);
      expect(service.searchText()).toBe('');
    });
  });

  describe('Selection', () => {
    const r1: TestRow = { id: 1, name: 'A' };
    const r2: TestRow = { id: 2, name: 'B' };

    it('single mode เลือกได้ 1 แถว', () => {
      service.selectRow(1, r1, 'single');
      service.selectRow(2, r2, 'single');
      expect(service.selectedKeys()).toEqual([2]);
    });

    it('multiple mode เลือกได้หลายแถว', () => {
      service.selectRow(1, r1, 'multiple');
      service.selectRow(2, r2, 'multiple');
      expect(service.selectedKeys().length).toBe(2);
    });

    it('multiple mode toggle deselect', () => {
      service.selectRow(1, r1, 'multiple');
      service.selectRow(1, r1, 'multiple');
      expect(service.selectedKeys().length).toBe(0);
    });

    it('clearSelection เคลียร์ทั้งหมด', () => {
      service.selectRow(1, r1, 'multiple');
      service.clearSelection();
      expect(service.selectedKeys()).toEqual([]);
    });

    it('selectAll เลือกทั้งหมด', () => {
      service.selectAll([r1, r2], 'id');
      expect(service.selectedKeys()).toEqual([1, 2]);
    });
  });

  describe('Edit', () => {
    it('recordEdit สะสมการแก้ไข', () => {
      service.recordEdit(1, { name: 'new name' });
      service.recordEdit(1, { name: 'newer' });
      expect(service.editChanges().get(1)).toEqual({ name: 'newer' });
    });

    it('clearEdits ล้างทั้งหมด', () => {
      service.recordEdit(1, { name: 'x' });
      service.clearEdits();
      expect(service.editChanges().size).toBe(0);
      expect(service.editingKey()).toBeNull();
    });
  });

  describe('loadParams', () => {
    it('คำนวณ skip จาก page และ pageSize', () => {
      service.setPageSize(20);
      service.totalCount.set(200);
      service.setPage(3);
      expect(service.loadParams().skip).toBe(40);
      expect(service.loadParams().take).toBe(20);
    });
  });
});
