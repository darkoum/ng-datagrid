import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResizableColumnDirective } from './resizable-column.directive';
import { By } from '@angular/platform-browser';

@Component({
  template: `<th appResizableColumn columnField="name" [minWidth]="60"
                 (widthChanged)="onWidthChanged($event)">ชื่อ</th>`,
  imports: [ResizableColumnDirective],
  standalone: true,
})
class TestHostComponent {
  lastChange: any;
  onWidthChanged(e: any) { this.lastChange = e; }
}

describe('ResizableColumnDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should create resize handle', () => {
    const handle = fixture.debugElement.nativeElement.querySelector('.col-resize-handle');
    expect(handle).toBeTruthy();
  });

  it('should set cursor on handle', () => {
    const handle = fixture.debugElement.nativeElement.querySelector('.col-resize-handle');
    expect(handle.style.cursor).toBe('col-resize');
  });

  it('should emit widthChanged after mouse drag', () => {
    const th     = fixture.debugElement.query(By.css('th')).nativeElement;
    const handle = th.querySelector('.col-resize-handle');

    handle.dispatchEvent(new MouseEvent('mousedown', { pageX: 100, bubbles: true }));
    document.dispatchEvent(new MouseEvent('mousemove', { pageX: 200 }));
    document.dispatchEvent(new MouseEvent('mouseup'));

    fixture.detectChanges();
    expect(fixture.componentInstance.lastChange).toBeDefined();
  });
});
