import { Component, Input, Output, EventEmitter, forwardRef, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface TaValueChangedEvent {
  value: string;
  previousValue: string;
}

/**
 * app-text-area — Drop-in replacement for dx-text-area
 *
 * Usage:
 *   <app-text-area
 *     [(ngModel)]="myText"
 *     [height]="120"
 *     [rows]="4"
 *     [autoResizeEnabled]="true"
 *     [maxLength]="500"
 *     placeholder="กรอกหมายเหตุ..."
 *     (onValueChanged)="fn($event)">
 *   </app-text-area>
 */
@Component({
  selector: 'app-text-area',
  standalone: true,
  imports: [CommonModule],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TextAreaComponent),
    multi: true,
  }],
  template: `
    <div class="app-ta" [class.app-ta--disabled]="disabled">
      <textarea class="app-ta__input"
                [value]="currentValue()"
                [disabled]="disabled"
                [readOnly]="readOnly"
                [attr.rows]="rows"
                [attr.maxlength]="maxLength ?? null"
                [attr.placeholder]="placeholder || null"
                [style.height.px]="height || null"
                [style.resize]="autoResizeEnabled ? 'none' : 'vertical'"
                (input)="onInput($event)"
                (blur)="onBlur()">
      </textarea>
      <div *ngIf="maxLength" class="app-ta__counter">
        {{ currentValue().length }} / {{ maxLength }}
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .app-ta { position: relative; }
    .app-ta--disabled { opacity: .55; }

    .app-ta__input {
      width: 100%; box-sizing: border-box;
      border: 1px solid #ced4da; border-radius: 4px;
      padding: 8px 10px; font-size: 14px;
      font-family: 'Sarabun', 'TH Sarabun New', sans-serif;
      outline: none; background: #fff; color: #333;
      resize: vertical; line-height: 1.5;
      transition: border-color .15s, box-shadow .15s;
    }
    .app-ta__input:focus {
      border-color: #86b7fe;
      box-shadow: 0 0 0 2px rgba(13,110,253,.15);
    }
    .app-ta__input:disabled { background: #e9ecef; cursor: not-allowed; }

    .app-ta__counter {
      text-align: right; font-size: 11px; color: #adb5bd; margin-top: 2px;
    }
  `],
})
export class TextAreaComponent implements ControlValueAccessor {
  @Input() placeholder = '';
  @Input() disabled = false;
  @Input() readOnly = false;
  @Input() rows = 4;
  @Input() height?: number;
  @Input() maxLength?: number;
  @Input() autoResizeEnabled = false;

  @Output() onValueChanged = new EventEmitter<TaValueChangedEvent>();

  currentValue = signal('');

  private _onChange: (v: any) => void = () => {};
  private _onTouched: () => void = () => {};

  onInput(event: Event) {
    const prev = this.currentValue();
    const next = (event.target as HTMLTextAreaElement).value;
    this.currentValue.set(next);
    this._onChange(next);
    this.onValueChanged.emit({ value: next, previousValue: prev });
  }

  onBlur() { this._onTouched(); }

  // ── ControlValueAccessor ───────────────────────────────────────
  writeValue(v: any): void { this.currentValue.set(v ?? ''); }
  registerOnChange(fn: any): void { this._onChange = fn; }
  registerOnTouched(fn: any): void { this._onTouched = fn; }
  setDisabledState(d: boolean): void { this.disabled = d; }
}
