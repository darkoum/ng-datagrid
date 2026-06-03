import {
  Directive, ElementRef, Input, Output, EventEmitter,
  OnInit, OnDestroy, Renderer2, inject
} from '@angular/core';

@Directive({
  selector: '[appResizableColumn]',
  standalone: true,
})
export class ResizableColumnDirective implements OnInit, OnDestroy {
  @Input() minWidth = 60;
  @Input() maxWidth = 1200;
  @Input() columnField = '';
  @Output() widthChanged = new EventEmitter<{ field: string; width: number }>();

  private el        = inject(ElementRef);
  private renderer  = inject(Renderer2);
  private handle!:  HTMLElement;
  private startX    = 0;
  private startW    = 0;
  private dragging  = false;
  private unlisten: (() => void)[] = [];

  ngOnInit(): void {
    this.renderer.setStyle(this.el.nativeElement, 'position', 'relative');
    this.renderer.setStyle(this.el.nativeElement, 'user-select', 'none');

    this.handle = this.renderer.createElement('div');
    this.renderer.addClass(this.handle, 'col-resize-handle');
    Object.assign(this.handle.style, {
      position:   'absolute',
      right:      '0',
      top:        '0',
      width:      '6px',
      height:     '100%',
      cursor:     'col-resize',
      background: 'transparent',
      zIndex:     '10',
    });
    this.renderer.appendChild(this.el.nativeElement, this.handle);

    this.unlisten.push(
      this.renderer.listen(this.handle, 'mouseenter', () => {
        this.handle.style.background = 'rgba(51,122,183,0.4)';
      }),
      this.renderer.listen(this.handle, 'mouseleave', () => {
        if (!this.dragging) this.handle.style.background = 'transparent';
      }),
      this.renderer.listen(this.handle, 'mousedown', (e: MouseEvent) => this.onMouseDown(e))
    );
  }

  ngOnDestroy(): void {
    this.unlisten.forEach(fn => fn());
  }

  private onMouseDown(e: MouseEvent): void {
    e.preventDefault();
    e.stopPropagation();
    this.dragging = true;
    this.startX   = e.pageX;
    this.startW   = this.el.nativeElement.offsetWidth;
    this.handle.style.background = 'rgba(51,122,183,0.7)';

    const bodyStyle  = document.body.style;
    const prevSelect = bodyStyle.userSelect;
    const prevCursor = bodyStyle.cursor;
    bodyStyle.userSelect = 'none';
    bodyStyle.cursor     = 'col-resize';

    const onMove = (ev: MouseEvent) => {
      if (!this.dragging) return;
      const delta    = ev.pageX - this.startX;
      const newWidth = Math.min(this.maxWidth, Math.max(this.minWidth, this.startW + delta));
      this.renderer.setStyle(this.el.nativeElement, 'width', `${newWidth}px`);
      this.renderer.setStyle(this.el.nativeElement, 'min-width', `${newWidth}px`);
    };

    const onUp = () => {
      this.dragging = false;
      this.handle.style.background = 'transparent';
      bodyStyle.userSelect = prevSelect;
      bodyStyle.cursor     = prevCursor;

      const finalWidth = this.el.nativeElement.offsetWidth;
      this.widthChanged.emit({ field: this.columnField, width: finalWidth });

      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }
}
