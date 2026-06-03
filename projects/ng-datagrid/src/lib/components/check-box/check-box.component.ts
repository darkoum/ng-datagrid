import { Component, Input, Output, EventEmitter, forwardRef, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface CbValueChangedEvent {
  value: boolean;
  previousValue: boolean;
}

/**
 * app-check-box — Drop-in replacement for dx-check-box
 *
 * Usage:
 *   <app-check-box
 *     [(ngModel)]="isActive"
 *     text="เปิดใช้งาน"
 *     (onValueChanged)="fn($event)">
 *   </app-check-box>
 */
@Component({
  selector: 'app-check-box',
  standalone: true,
  imports: [CommonModule],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CheckBoxComponent),
    multi: true,
  }],
  template: `
    <label class="app-cb" [class.app-cb--disabled]="disabled">
      <span class="app-cb__box" [class.app-cb__box--checked]="currentValue()" [class.app-cb__box--indeterminate]="value === null">
        <svg *ngIf="currentValue()" viewBox="0 0 12 10" fill="none">
          <polyline points="1,5 4.5,9 11,1" stroke="white" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <svg *ngIf="value === null" viewBox="0 0 12 4" fill="none">
          <line x1="1" y1="2" x2="11" y2="2" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
        </svg>
      </span>
      <input type="checkbox"
             class="app-cb__input"
             [checked]="currentValue()"
             [disabled]="disabled"
             (change)="onChange($event)">
      <span *ngIf="text" class="app-cb__text">{{ text }}</span>
    </label>
  `,
  styles: [`
    :host { display: inline-block; }

    .app-cb {
      display: inline-flex; align-items: center; gap: 8px;
      cursor: pointer; user-select: none; font-size: 14px; color: #333;
      line-height: 1.4;
    }
    .app-cb--disabled { opacity: .55; cursor: not-allowed; }

    .app-cb__input { display: none; }

    .app-cb__box {
      flex-shrink: 0;
      width: 18px; height: 18px;
      border: 2px solid #ced4da;
      border-radius: 3px;
      background: #fff;
      display: flex; align-items: center; justify-content: center;
      transition: background .15s, border-color .15s;
    }

    .app-cb:hover:not(.app-cb--disabled) .app-cb__box {
      border-color: #337ab7;
    }

    .app-cb__box--checked,
    .app-cb__box--indeterminate {
      background: #337ab7;
      border-color: #337ab7;
    }

    .app-cb__box svg { width: 12px; height: 10px; display: block; }

    .app-cb__text { line-height: 1.4; }
  `],
})
export class CheckBoxComponent implements ControlValueAccessor {
  @Input() text = '';
  @Input() disabled = false;
  /** null = indeterminate state */
  @Input() value: boolean | null = false;

  @Output() onValueChanged = new EventEmitter<CbValueChangedEvent>();

  currentValue = signal<boolean>(false);

  private _onChange: (v: any) => void = () => {};
  private _onTouched: () => void = () => {};

  onChange(event: Event) {
    const prev = this.currentValue();
    const next = (event.target as HTMLInputElement).checked;
    this.currentValue.set(next);
    this._onChange(next);
    this._onTouched();
    this.onValueChanged.emit({ value: next, previousValue: prev });
  }

  // ── ControlValueAccessor ───────────────────────────────────────
  writeValue(v: any): void { this.currentValue.set(!!v); }
  registerOnChange(fn: any): void { this._onChange = fn; }
  registerOnTouched(fn: any): void { this._onTouched = fn; }
  setDisabledState(d: boolean): void { this.disabled = d; }
}
