import {
  Component, Input, Output, EventEmitter, forwardRef, OnChanges, SimpleChanges,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ThaiDatepickerComponent } from '../thai-datepicker/thai-datepicker.component';
import { ThaiDateFormat } from '../../models/datagrid.types';

export interface DbValueChangedEvent {
  value: Date | string | null;
  previousValue: Date | string | null;
}

/**
 * app-date-box — Drop-in replacement for dx-date-box (Thai Buddhist Era)
 *
 * Usage:
 *   <app-date-box
 *     [(ngModel)]="myDate"
 *     [format]="'shortDate'"
 *     [showClearButton]="true"
 *     [placeholder]="'เลือกวันที่'"
 *     (onValueChanged)="fn($event)">
 *   </app-date-box>
 *
 * Supports two-way binding via ngModel or [(value)]
 */
@Component({
  selector: 'app-date-box',
  standalone: true,
  imports: [CommonModule, FormsModule, ThaiDatepickerComponent],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DateBoxComponent),
    multi: true,
  }],
  template: `
    <app-thai-datepicker
      [ngModel]="_innerValue"
      (valueChange)="onDateChange($event)"
      [disabled]="disabled || readOnly"
      [format]="format"
      [placeholder]="placeholder">
    </app-thai-datepicker>
  `,
  styles: [`:host { display: block; }`],
})
export class DateBoxComponent implements ControlValueAccessor, OnChanges {
  @Input() value: Date | string | null = null;
  @Input() format: ThaiDateFormat = 'shortDate';
  @Input() placeholder = 'เลือกวันที่';
  @Input() disabled = false;
  @Input() readOnly = false;
  @Input() showClearButton = false;
  @Input() type: 'date' | 'datetime' | 'time' = 'date';
  @Input() min?: Date | string;
  @Input() max?: Date | string;
  @Input() displayFormat?: string;

  @Output() valueChange = new EventEmitter<Date | string | null>();
  @Output() onValueChanged = new EventEmitter<DbValueChangedEvent>();

  _innerValue: Date | string | null = null;

  private _onChange: (v: any) => void = () => {};
  private _onTouched: () => void = () => {};
  private _previousValue: Date | string | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value']) {
      this._innerValue = this.value;
    }
  }

  onDateChange(val: Date | string | null): void {
    const prev = this._previousValue;
    this._innerValue = val;
    this._previousValue = val;
    this._onChange(val);
    this._onTouched();
    this.valueChange.emit(val);
    this.onValueChanged.emit({ value: val, previousValue: prev });
  }

  // ── ControlValueAccessor ───────────────────────────────────────
  writeValue(v: any): void {
    this._innerValue = v ?? null;
    this._previousValue = v ?? null;
  }
  registerOnChange(fn: any): void { this._onChange = fn; }
  registerOnTouched(fn: any): void { this._onTouched = fn; }
  setDisabledState(d: boolean): void { this.disabled = d; }
}
