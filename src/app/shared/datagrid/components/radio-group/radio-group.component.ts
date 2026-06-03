import { Component, Input, Output, EventEmitter, forwardRef, signal, OnChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface RgValueChangedEvent {
  value: any;
  previousValue: any;
}

/**
 * app-radio-group — Drop-in replacement for dx-radio-group
 *
 * Usage:
 *   <app-radio-group
 *     [items]="[{text:'ชาย',value:'M'},{text:'หญิง',value:'F'}]"
 *     displayExpr="text"
 *     valueExpr="value"
 *     layout="horizontal"
 *     [(ngModel)]="gender"
 *     (onValueChanged)="fn($event)">
 *   </app-radio-group>
 *
 *   <!-- หรือส่ง plain string[] -->
 *   <app-radio-group [items]="['น้อย','กลาง','มาก']" [(ngModel)]="level">
 *   </app-radio-group>
 */
@Component({
  selector: 'app-radio-group',
  standalone: true,
  imports: [CommonModule],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => RadioGroupComponent),
    multi: true,
  }],
  template: `
    <div class="app-rg"
         [class.app-rg--horizontal]="layout === 'horizontal'"
         [class.app-rg--disabled]="disabled">
      @for (item of items; track getVal(item)) {
        <label class="app-rg__item">
          <span class="app-rg__radio" [class.app-rg__radio--checked]="getVal(item) === currentValue()">
            <span *ngIf="getVal(item) === currentValue()" class="app-rg__dot"></span>
          </span>
          <input type="radio"
                 class="app-rg__input"
                 [value]="getVal(item)"
                 [checked]="getVal(item) === currentValue()"
                 [disabled]="disabled"
                 (change)="onSelect(item)">
          <span class="app-rg__text">{{ getDisp(item) }}</span>
        </label>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }

    .app-rg {
      display: flex; flex-direction: column; gap: 8px;
    }
    .app-rg--horizontal { flex-direction: row; flex-wrap: wrap; gap: 16px; }
    .app-rg--disabled { opacity: .55; pointer-events: none; }

    .app-rg__item {
      display: inline-flex; align-items: center; gap: 8px;
      cursor: pointer; user-select: none; font-size: 14px; color: #333;
    }
    .app-rg__input { display: none; }

    .app-rg__radio {
      flex-shrink: 0;
      width: 18px; height: 18px;
      border: 2px solid #ced4da; border-radius: 50%;
      background: #fff;
      display: flex; align-items: center; justify-content: center;
      transition: border-color .15s;
    }
    .app-rg__item:hover .app-rg__radio { border-color: #337ab7; }
    .app-rg__radio--checked { border-color: #337ab7; }

    .app-rg__dot {
      width: 9px; height: 9px;
      background: #337ab7; border-radius: 50%;
    }

    .app-rg__text { line-height: 1.4; }
  `],
})
export class RadioGroupComponent implements ControlValueAccessor, OnChanges {
  @Input() items: any[] = [];
  @Input() displayExpr: string | ((item: any) => string) = 'text';
  @Input() valueExpr: string = 'value';
  @Input() layout: 'vertical' | 'horizontal' = 'vertical';
  @Input() disabled = false;

  @Output() onValueChanged = new EventEmitter<RgValueChangedEvent>();

  currentValue = signal<any>(null);

  private _onChange: (v: any) => void = () => {};
  private _onTouched: () => void = () => {};

  ngOnChanges() { /* trigger recompute */ }

  getDisp(item: any): string {
    if (item === null || item === undefined) return '';
    if (typeof item !== 'object') return String(item);
    if (typeof this.displayExpr === 'function') return this.displayExpr(item);
    return String(item[this.displayExpr as string] ?? '');
  }

  getVal(item: any): any {
    if (item === null || item === undefined) return null;
    if (typeof item !== 'object') return item;
    return this.valueExpr ? item[this.valueExpr] : item;
  }

  onSelect(item: any): void {
    const prev = this.currentValue();
    const next = this.getVal(item);
    this.currentValue.set(next);
    this._onChange(next);
    this._onTouched();
    this.onValueChanged.emit({ value: next, previousValue: prev });
  }

  // ── ControlValueAccessor ───────────────────────────────────────
  writeValue(v: any): void { this.currentValue.set(v ?? null); }
  registerOnChange(fn: any): void { this._onChange = fn; }
  registerOnTouched(fn: any): void { this._onTouched = fn; }
  setDisabledState(d: boolean): void { this.disabled = d; }
}
