import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * DevExtreme icon name → Unicode/HTML mapping
 */
const DX_ICON: Record<string, string> = {
  find:          '🔍',
  search:        '🔍',
  add:           '+',
  plus:          '+',
  trash:         '🗑',
  remove:        '✕',
  delete:        '🗑',
  edit:          '✏',
  save:          '💾',
  check:         '✓',
  todo:          '✓',
  selectall:     '☑',
  unselectall:   '☐',
  export:        '⬇',
  exportxlsx:    '📊',
  exportpdf:     '📄',
  download:      '⬇',
  upload:        '⬆',
  refresh:       '↺',
  revert:        '↺',
  close:         '✕',
  clear:         '✕',
  print:         '🖨',
  user:          '👤',
  group:         '👥',
  folder:        '📁',
  file:          '📄',
  home:          '🏠',
  info:          'ℹ',
  warning:       '⚠',
  help:          '?',
  overflow:      '⋯',
  back:          '←',
  forward:       '→',
  columnchooser: '⚙',
  filter:        '⊟',
  reorder:       '⇅',
};

/**
 * app-button — Drop-in replacement for dx-button
 *
 * Usage:
 *   <app-button
 *     text="ค้นหา"
 *     icon="find"
 *     type="default"
 *     [width]="'100%'"
 *     (onClick)="onSearch()">
 *   </app-button>
 *
 * type: 'default' (blue) | 'success' (green) | 'danger' (red) |
 *       'normal' (gray) | 'back' (outline)
 */
@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button class="app-btn app-btn--{{ type }}"
            [class.app-btn--icon-only]="!text && icon"
            [style.width]="widthStyle"
            [disabled]="disabled"
            type="button"
            (click)="onClick.emit($event)">
      @if (resolvedIcon) {
        <span class="app-btn__icon">{{ resolvedIcon }}</span>
      }
      @if (text) {
        <span class="app-btn__text">{{ text }}</span>
      }
    </button>
  `,
  styles: [`
    :host { display: inline-block; }

    .app-btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 5px;
      padding: 5px 14px; border-radius: 4px; border: 1px solid transparent;
      font-size: 14px; cursor: pointer; user-select: none;
      white-space: nowrap; transition: background .15s, border-color .15s, opacity .15s;
      min-height: 34px;
    }
    .app-btn[disabled] { opacity: .55; cursor: not-allowed; }
    .app-btn--icon-only { padding: 5px 10px; }

    /* default – blue */
    .app-btn--default {
      background: #0d6efd; color: #fff; border-color: #0d6efd;
    }
    .app-btn--default:hover:not([disabled]) {
      background: #0b5ed7; border-color: #0a58ca;
    }

    /* success – green */
    .app-btn--success {
      background: #198754; color: #fff; border-color: #198754;
    }
    .app-btn--success:hover:not([disabled]) {
      background: #157347; border-color: #146c43;
    }

    /* danger – red */
    .app-btn--danger {
      background: #dc3545; color: #fff; border-color: #dc3545;
    }
    .app-btn--danger:hover:not([disabled]) {
      background: #bb2d3b; border-color: #b02a37;
    }

    /* normal – gray outline */
    .app-btn--normal {
      background: #fff; color: #495057; border-color: #ced4da;
    }
    .app-btn--normal:hover:not([disabled]) { background: #f8f9fa; }

    /* back – gray ghost */
    .app-btn--back {
      background: transparent; color: #6c757d; border-color: #6c757d;
    }
    .app-btn--back:hover:not([disabled]) { background: #f8f9fa; }

    .app-btn__icon { font-size: 15px; line-height: 1; }
    .app-btn__text { line-height: 1.4; }
  `],
})
export class ButtonComponent {
  @Input() text = '';
  @Input() icon = '';
  @Input() type: 'default' | 'success' | 'danger' | 'normal' | 'back' = 'normal';
  @Input() disabled = false;
  @Input() width?: string | number;

  @Output() onClick = new EventEmitter<MouseEvent>();

  get resolvedIcon(): string {
    if (!this.icon) return '';
    return DX_ICON[this.icon.toLowerCase()] ?? this.icon;
  }

  get widthStyle(): string {
    if (!this.width) return '';
    return typeof this.width === 'number' ? `${this.width}px` : String(this.width);
  }
}
