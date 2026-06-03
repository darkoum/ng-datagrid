import { Component, Input, Output, EventEmitter, forwardRef, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface SwValueChangedEvent {
  value: boolean;
  previousValue: boolean;
}

/**
 * app-switch — Drop-in replacement for dx-switch (toggle)
 *
 * Usage:
 *   <app-switch
 *     [(ngModel)]="isEnabled"
 *     switchedOnText="เปิด"
 *     switchedOffText="ปิด"
 *     (onValueChanged)="fn($event)">
 *   </app-switch>
 */
@Component({
  selector: 'app-switch',
  standalone: true,
  imports: [CommonModule],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SwitchComponent),
    multi: true,
  }],
  template: `
    <label class="app-sw" [class.app-sw--on]="currentValue()" [class.app-sw--disabled]="disabled">
      <input type="checkbox"
             class="app-sw__input"
             [checked]="currentValue()"
             [disabled]="disabled"
             (change)="onToggle($event)">
      <span class="app-sw__track">
        <span class="app-sw__thumb"></span>
        <span *ngIf="switchedOnText || switchedOffText" class="app-sw__label">
          {{ currentValue() ? switchedOnText : switchedOffText }}
        </span>
      </span>
    </label>
  `,
  styles: [`
    :host { display: inline-block; }

    .app-sw {
      display: inline-flex; align-items: center;
      cursor: pointer; user-select: none;
    }
    .app-sw--disabled { opacity: .55; cursor: not-allowed; }
    .app-sw__input { display: none; }

    .app-sw__track {
      position: relative;
      display: inline-flex; align-items: center;
      width: 52px; height: 26px;
      background: #ced4da; border-radius: 13px;
      padding: 0 3px;
      transition: background .2s;
    }
    .app-sw--on .app-sw__track { background: #337ab7; }

    .app-sw__thumb {
      position: absolute;
      left: 3px;
      width: 20px; height: 20px;
      background: #fff; border-radius: 50%;
      box-shadow: 0 1px 3px rgba(0,0,0,.3);
      transition: transform .2s;
    }
    .app-sw--on .app-sw__thumb { transform: translateX(26px); }

    .app-sw__label {
      position: absolute;
      font-size: 10px; font-weight: 700;
      color: #fff; line-height: 1;
      right: 6px; letter-spacing: .02em;
      transition: right .2s, left .2s;
    }
    .app-sw--on .app-sw__label { right: auto; left: 6px; }
  `],
})
export class SwitchComponent implements ControlValueAccessor {
  @Input() switchedOnText = '';
  @Input() switchedOffText = '';
  @Input() disabled = false;

  @Output() onValueChanged = new EventEmitter<SwValueChangedEvent>();

  currentValue = signal(false);

  private _onChange: (v: any) => void = () => {};
  private _onTouched: () => void = () => {};

  onToggle(event: Event) {
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
