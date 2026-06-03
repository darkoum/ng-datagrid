import {
  Component, Input, Output, EventEmitter, HostListener,
  ElementRef, ViewChild, OnChanges, SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * app-popup — Drop-in replacement for dx-popup
 *
 * Usage:
 *   <app-popup
 *     [(visible)]="popupVisible"
 *     title="ชื่อ Popup"
 *     [showTitle]="true"
 *     [width]="'40%'"
 *     [height]="'auto'"
 *     [dragEnabled]="false"
 *     [closeOnOutsideClick]="true"
 *     (onHiding)="onClose()">
 *
 *     <!-- content here -->
 *
 *   </app-popup>
 */
@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (visible) {
      <!-- Overlay -->
      <div class="app-pp__overlay"
           (click)="onOverlayClick()">
      </div>

      <!-- Dialog -->
      <div class="app-pp__dialog"
           [style.width]="widthStyle"
           [style.max-height]="heightStyle === 'auto' ? '90vh' : heightStyle"
           [style.height]="heightStyle === 'auto' ? 'auto' : heightStyle"
           #dialog
           role="dialog"
           [attr.aria-labelledby]="showTitle ? 'pp-title' : null">

        @if (showTitle) {
          <div class="app-pp__header">
            <span class="app-pp__title" id="pp-title">{{ title }}</span>
            <button class="app-pp__close" type="button" (click)="hide()" aria-label="ปิด">✕</button>
          </div>
        } @else {
          <button class="app-pp__close app-pp__close--corner" type="button" (click)="hide()" aria-label="ปิด">✕</button>
        }

        <div class="app-pp__body">
          <ng-content></ng-content>
        </div>

      </div>
    }
  `,
  styles: [`
    :host { /* intentionally empty — contents are absolutely positioned */ }

    .app-pp__overlay {
      position: fixed; inset: 0; z-index: 1070;
      background: rgba(0,0,0,0.45);
      animation: app-pp-fadein .15s ease;
    }

    .app-pp__dialog {
      position: fixed; top: 50%; left: 50%; z-index: 1071;
      transform: translate(-50%, -50%);
      background: #fff; border-radius: 6px;
      box-shadow: 0 8px 32px rgba(0,0,0,.25);
      display: flex; flex-direction: column;
      max-width: 95vw;
      animation: app-pp-slidein .15s ease;
      overflow: hidden;
    }

    @keyframes app-pp-fadein  { from { opacity: 0; } to { opacity: 1; } }
    @keyframes app-pp-slidein { from { transform: translate(-50%, -52%) scale(.97); opacity: 0; } to { transform: translate(-50%, -50%) scale(1); opacity: 1; } }

    .app-pp__header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 12px 16px; border-bottom: 1px solid #dee2e6;
      background: #f8f9fa; flex-shrink: 0;
    }
    .app-pp__title { font-size: 15px; font-weight: 600; color: #212529; }

    .app-pp__close {
      background: none; border: none; cursor: pointer; color: #6c757d;
      font-size: 16px; padding: 2px 4px; border-radius: 3px; line-height: 1;
      flex-shrink: 0;
    }
    .app-pp__close:hover { background: #e9ecef; color: #212529; }
    .app-pp__close--corner {
      position: absolute; top: 8px; right: 8px; z-index: 1;
    }

    .app-pp__body {
      padding: 16px; overflow-y: auto; flex: 1;
    }
  `],
})
export class PopupComponent {
  @Input() visible = false;
  @Input() title = '';
  @Input() showTitle = true;
  @Input() width: string | number = '500px';
  @Input() height: string | number = 'auto';
  @Input() dragEnabled = false;
  @Input() closeOnOutsideClick = true;
  @Input() resizeEnabled = false;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() onHiding = new EventEmitter<void>();
  @Output() onShown = new EventEmitter<void>();

  @ViewChild('dialog') dialogRef?: ElementRef<HTMLElement>;

  get widthStyle(): string {
    const w = this.width;
    if (!w) return '500px';
    return typeof w === 'number' ? `${w}px` : String(w);
  }

  get heightStyle(): string {
    const h = this.height;
    if (!h || h === 'auto') return 'auto';
    return typeof h === 'number' ? `${h}px` : String(h);
  }

  onOverlayClick() {
    if (this.closeOnOutsideClick) this.hide();
  }

  hide() {
    this.visible = false;
    this.visibleChange.emit(false);
    this.onHiding.emit();
  }

  show() {
    this.visible = true;
    this.visibleChange.emit(true);
    setTimeout(() => this.onShown.emit(), 150);
  }

  @HostListener('document:keydown.escape')
  onEsc() {
    if (this.visible && this.closeOnOutsideClick) this.hide();
  }
}
