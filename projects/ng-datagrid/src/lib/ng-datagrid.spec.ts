import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgDatagrid } from './ng-datagrid';

describe('NgDatagrid', () => {
  let component: NgDatagrid;
  let fixture: ComponentFixture<NgDatagrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgDatagrid],
    }).compileComponents();

    fixture = TestBed.createComponent(NgDatagrid);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
