import { Component, Input, Output, EventEmitter, forwardRef, signal, HostListener } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface TbValueChangedEvent {
  value: string;
  previousValue: string;
}

/**
 * app-text-box — Drop-in replacement for dx-text-box
 *
 * Usage:
 *   <app-text-box
 *     [(ngModel)]="myText"
 *     [showClearButton]="true"
 *     [placeholder]="'ค้นหา...'"
 *     (onValueChanged)="fn($event)">
 *   </app-text-box>
 */
@Component({
  selector: 'app-text-box',
  standalone: true,
  imports: [CommonModule],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TextBoxComponent),
    multi: true,
  }],
  template: `
    <div class="app-tb" [class.app-tb--disabled]="disabled">
      <input class="app-tb__input"
             [type]="mode === 'password' ? 'password' : 'text'"
             [value]="currentValue()"
             [disabled]="disabled"
             [placeholder]="placeholder"
             [readOnly]="readOnly"
             (input)="onInput($event)"
             (keydown.enter)="onEnterKey.emit()"
             (blur)="onBlur()">
      @if (showClearButton && currentValue()) {
        <button class="app-tb__clear" type="button" (click)="clear()" [disabled]="disabled">✕</button>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }

    .app-tb {
      display: flex; align-items: center;
      border: 1px solid #ced4da; border-radius: 4px;
      background: #fff; overflow: hidden; transition: border-color .15s;
    }
    .app-tb:focus-within { border-color: #86b7fe; box-shadow: 0 0 0 2px rgba(13,110,253,.15); }
    .app-tb--disabled { background: #e9ecef; }

    .app-tb__input {
      flex: 1; border: none; outline: none; padding: 5px 8px;
      font-size: 14px; background: transparent; min-width: 0;
    }
    .app-tb--disabled .app-tb__input { color: #6c757d; cursor: not-allowed; }

    .app-tb__clear {
      flex-shrink: 0; background: none; border: none; cursor: pointer;
      color: #adb5bd; font-size: 11px; padding: 0 6px;
    }
    .app-tb__clear:hover:not([disabled]) { color: #495057; }
  `],
})
export class TextBoxComponent implements ControlValueAccessor {
  @Input() placeholder = '';
  @Input() disabled = false;
  @Input() readOnly = false;
  @Input() showClearButton = false;
  @Input() mode: 'text' | 'password' | 'email' | 'search' = 'text';
  @Input() maxLength?: number;

  @Output() onValueChanged = new EventEmitter<TbValueChangedEvent>();
  @Output() onEnterKey = new EventEmitter<void>();

  currentValue = signal('');

  private _onChange: (v: any) => void = () => {};
  private _onTouched: () => void = () => {};

  onInput(event: Event) {
    const prev = this.currentValue();
    const next = (event.target as HTMLInputElement).value;
    this.currentValue.set(next);
    this._onChange(next);
    this.onValueChanged.emit({ value: next, previousValue: prev });
  }

  onBlur() { this._onTouched(); }

  clear() {
    const prev = this.currentValue();
    this.currentValue.set('');
    this._onChange('');
    this.onValueChanged.emit({ value: '', previousValue: prev });
  }

  // ── ControlValueAccessor ───────────────────────────────────────
  writeValue(v: any) { this.currentValue.set(v ?? ''); }
  registerOnChange(fn: any) { this._onChange = fn; }
  registerOnTouched(fn: any) { this._onTouched = fn; }
  setDisabledState(d: boolean) { this.disabled = d; }
}
