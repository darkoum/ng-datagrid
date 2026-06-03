import {
  Component, Input, Output, EventEmitter, forwardRef, signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface NbValueChangedEvent {
  value: number | null;
  previousValue: number | null;
}

/**
 * app-number-box — Drop-in replacement for dx-number-box
 *
 * Usage:
 *   <app-number-box
 *     [(ngModel)]="acadyear"
 *     [showSpinButtons]="true"
 *     [min]="1" [max]="9999"
 *     [showClearButton]="true"
 *     (onValueChanged)="fn($event)">
 *   </app-number-box>
 */
@Component({
  selector: 'app-number-box',
  standalone: true,
  imports: [CommonModule],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NumberBoxComponent),
    multi: true,
  }],
  template: `
    <div class="app-nb" [class.app-nb--disabled]="disabled">
      @if (showSpinButtons) {
        <button class="app-nb__spin app-nb__spin--down" type="button"
                (click)="spin(-1)" [disabled]="disabled || atMin">
          −
        </button>
      }
      <input class="app-nb__input"
             type="number"
             [value]="formattedValue"
             [min]="min ?? null"
             [max]="max ?? null"
             [step]="step"
             [disabled]="disabled"
             [placeholder]="placeholder"
             (input)="onInput($event)"
             (blur)="onBlur()">
      @if (showClearButton && currentValue() !== null && currentValue() !== undefined) {
        <button class="app-nb__clear" type="button" (click)="clear()" [disabled]="disabled">✕</button>
      }
      @if (showSpinButtons) {
        <button class="app-nb__spin app-nb__spin--up" type="button"
                (click)="spin(1)" [disabled]="disabled || atMax">
          +
        </button>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }

    .app-nb {
      display: flex; align-items: stretch; border: 1px solid #ced4da;
      border-radius: 4px; overflow: hidden; background: #fff;
    }
    .app-nb--disabled { background: #e9ecef; }

    .app-nb__input {
      flex: 1; border: none; outline: none; padding: 5px 8px; font-size: 14px;
      min-width: 0; background: transparent; text-align: right;
    }
    .app-nb__input::-webkit-inner-spin-button,
    .app-nb__input::-webkit-outer-spin-button { -webkit-appearance: none; }
    .app-nb__input[type=number] { -moz-appearance: textfield; }
    .app-nb--disabled .app-nb__input { color: #6c757d; cursor: not-allowed; }

    .app-nb__spin {
      flex-shrink: 0; width: 28px; border: none; background: #f8f9fa;
      cursor: pointer; font-size: 16px; color: #495057; border-left: 1px solid #ced4da;
      display: flex; align-items: center; justify-content: center;
      user-select: none; transition: background .15s;
    }
    .app-nb__spin--down { order: -1; border-left: none; border-right: 1px solid #ced4da; }
    .app-nb__spin:hover:not([disabled]) { background: #e2e6ea; }
    .app-nb__spin[disabled] { color: #adb5bd; cursor: not-allowed; }

    .app-nb__clear {
      flex-shrink: 0; background: none; border: none; cursor: pointer;
      color: #adb5bd; font-size: 11px; padding: 0 6px;
    }
    .app-nb__clear:hover:not([disabled]) { color: #495057; }
  `],
})
export class NumberBoxComponent implements ControlValueAccessor {
  @Input() min?: number;
  @Input() max?: number;
  @Input() step = 1;
  @Input() showSpinButtons = false;
  @Input() showClearButton = false;
  @Input() placeholder = '';
  @Input() disabled = false;
  @Input() format?: string;

  @Output() onValueChanged = new EventEmitter<NbValueChangedEvent>();

  currentValue = signal<number | null>(null);

  private _onChange: (v: any) => void = () => {};
  private _onTouched: () => void = () => {};

  /** แสดงค่าตาม format เช่น '#,##0.00' หรือ 'currency' */
  get formattedValue(): string {
    const v = this.currentValue();
    if (v === null || v === undefined) return '';
    if (!this.format) return String(v);
    try {
      if (this.format === 'currency' || this.format === 'fixedPoint') {
        return v.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      }
      if (this.format === 'integer' || this.format === '#,##0') {
        return v.toLocaleString('th-TH', { maximumFractionDigits: 0 });
      }
      // pattern เช่น '#,##0.00'
      const decimals = (this.format.split('.')[1] ?? '').replace(/#|0/g, '').length
        || (this.format.match(/\.([0#]+)/)?.[1]?.length ?? 0);
      return v.toLocaleString('th-TH', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
    } catch { return String(v); }
  }

  get atMin(): boolean {
    return this.min !== undefined && (this.currentValue() ?? -Infinity) <= this.min;
  }
  get atMax(): boolean {
    return this.max !== undefined && (this.currentValue() ?? Infinity) >= this.max;
  }

  onInput(event: Event) {
    const raw = (event.target as HTMLInputElement).value;
    const prev = this.currentValue();
    const next = raw === '' ? null : Number(raw);
    const clamped = this.clamp(next);
    this.currentValue.set(clamped);
    this._onChange(clamped);
    this.onValueChanged.emit({ value: clamped, previousValue: prev });
  }

  onBlur() { this._onTouched(); }

  spin(dir: 1 | -1) {
    const prev = this.currentValue() ?? 0;
    const next = this.clamp(prev + dir * this.step);
    this.currentValue.set(next);
    this._onChange(next);
    this.onValueChanged.emit({ value: next, previousValue: prev });
  }

  clear() {
    const prev = this.currentValue();
    this.currentValue.set(null);
    this._onChange(null);
    this.onValueChanged.emit({ value: null, previousValue: prev });
  }

  private clamp(v: number | null): number | null {
    if (v === null) return null;
    if (this.min !== undefined && v < this.min) return this.min;
    if (this.max !== undefined && v > this.max) return this.max;
    return v;
  }

  // ── ControlValueAccessor ───────────────────────────────────────
  writeValue(v: any) {
    this.currentValue.set(v !== null && v !== undefined ? Number(v) : null);
  }
  registerOnChange(fn: any) { this._onChange = fn; }
  registerOnTouched(fn: any) { this._onTouched = fn; }
  setDisabledState(d: boolean) { this.disabled = d; }
}
