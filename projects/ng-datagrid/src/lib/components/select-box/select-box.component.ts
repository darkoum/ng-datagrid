import {
  Component, Input, Output, EventEmitter, forwardRef,
  signal, computed, ViewChild, ElementRef, HostListener, OnChanges,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface SbValueChangedEvent {
  value: any;
  previousValue: any;
}

/**
 * app-select-box — Drop-in replacement for dx-select-box
 *
 * Usage:
 *   <app-select-box
 *     [dataSource]="myList"
 *     displayExpr="comboshow"
 *     valueExpr="comboid"
 *     [searchEnabled]="true"
 *     [showClearButton]="true"
 *     [(ngModel)]="myValue"
 *     (onValueChanged)="fn($event)">
 *   </app-select-box>
 */
@Component({
  selector: 'app-select-box',
  standalone: true,
  imports: [CommonModule],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SelectBoxComponent),
    multi: true,
  }],
  template: `
    <div class="app-sb" [class.app-sb--disabled]="disabled" [class.app-sb--open]="open()">

      <!-- ─── Trigger ─────────────────────────────────────────── -->
      <div class="app-sb__control" (click)="!disabled && toggleDropdown()">
        <span class="app-sb__text" [class.app-sb__text--ph]="!displayValue">
          {{ displayValue || placeholder }}
        </span>
        <div class="app-sb__icons">
          @if (showClearButton && hasValue) {
            <button class="app-sb__clear" type="button" (click)="clear($event)">✕</button>
          }
          <span class="app-sb__arrow">▾</span>
        </div>
      </div>

      <!-- ─── Dropdown ─────────────────────────────────────────── -->
      @if (open()) {
        <div class="app-sb__dropdown">
          @if (searchEnabled) {
            <div class="app-sb__search-wrap">
              <input #searchInput
                     class="app-sb__search"
                     type="text"
                     [value]="searchText()"
                     (input)="onSearch($event)"
                     (click)="$event.stopPropagation()"
                     placeholder="ค้นหา...">
            </div>
          }
          <div class="app-sb__list">
            @for (item of filteredItems; track getVal(item)) {
              <div class="app-sb__item"
                   [class.app-sb__item--active]="getVal(item) === currentValue()"
                   (click)="selectItem(item)">
                {{ getDisp(item) }}
              </div>
            }
            @if (filteredItems.length === 0) {
              <div class="app-sb__empty">ไม่พบข้อมูล</div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: block; width: 100%; min-width: 0; }

    .app-sb { position: relative; font-size: 14px; width: 100%; min-width: 0; }

    .app-sb__control {
      display: flex; align-items: center; justify-content: space-between;
      border: 1px solid #ced4da; border-radius: 4px; padding: 5px 8px;
      background: #fff; cursor: pointer; min-height: 34px; box-sizing: border-box; user-select: none;
      transition: border-color .15s;
    }
    .app-sb--open .app-sb__control,
    .app-sb__control:hover { border-color: #86b7fe; }
    .app-sb--disabled .app-sb__control {
      background: #e9ecef; cursor: not-allowed; color: #6c757d;
    }

    .app-sb__text {
      flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .app-sb__text--ph { color: #adb5bd; }

    .app-sb__icons {
      display: flex; align-items: center; gap: 3px; margin-left: 6px; flex-shrink: 0;
    }
    .app-sb__clear {
      background: none; border: none; cursor: pointer; color: #adb5bd;
      font-size: 11px; padding: 0 2px; line-height: 1;
    }
    .app-sb__clear:hover { color: #495057; }
    .app-sb__arrow { color: #adb5bd; font-size: 11px; transition: transform .2s; }
    .app-sb--open .app-sb__arrow { transform: rotate(180deg); }

    .app-sb__dropdown {
      position: absolute; top: calc(100% + 2px); left: 0; right: 0; z-index: 1050;
      background: #fff; border: 1px solid #dee2e6; border-radius: 4px;
      box-shadow: 0 4px 12px rgba(0,0,0,.12);
    }

    .app-sb__search-wrap { padding: 6px 8px; border-bottom: 1px solid #f0f0f0; }
    .app-sb__search {
      width: 100%; border: 1px solid #dee2e6; border-radius: 3px;
      padding: 4px 8px; font-size: 13px; outline: none; box-sizing: border-box;
    }
    .app-sb__search:focus { border-color: #86b7fe; box-shadow: 0 0 0 2px rgba(13,110,253,.15); }

    .app-sb__list { max-height: 200px; overflow-y: auto; }

    .app-sb__item {
      padding: 7px 12px; cursor: pointer; font-size: 14px; white-space: nowrap;
      overflow: hidden; text-overflow: ellipsis;
    }
    .app-sb__item:hover { background: #f0f7ff; }
    .app-sb__item--active { background: #e3f0ff; color: #0d6efd; font-weight: 500; }

    .app-sb__empty { padding: 10px 12px; color: #adb5bd; font-size: 13px; }
  `],
})
export class SelectBoxComponent implements ControlValueAccessor, OnChanges {
  @Input() dataSource: any[] = [];
  @Input() displayExpr: string | ((item: any) => string) = 'name';
  @Input() valueExpr: string = 'id';
  @Input() searchEnabled = false;
  @Input() showClearButton = false;
  @Input() placeholder = 'เลือก...';
  @Input() disabled = false;
  @Input() searchMode: 'contains' | 'StartsWith' | 'startsWith' = 'contains';

  @Output() onValueChanged = new EventEmitter<SbValueChangedEvent>();

  @ViewChild('searchInput') searchInputRef?: ElementRef<HTMLInputElement>;

  open = signal(false);
  searchText = signal('');
  currentValue = signal<any>(null);

  private _onChange: (v: any) => void = () => {};
  private _onTouched: () => void = () => {};

  ngOnChanges() { /* trigger getter recompute via CD */ }

  get filteredItems(): any[] {
    const q = this.searchText().toLowerCase();
    const src = this.dataSource ?? [];
    if (!q) return src;
    const mode = this.searchMode.toLowerCase();
    return src.filter(item => {
      const text = this.getDisp(item).toLowerCase();
      return mode === 'startswith' ? text.startsWith(q) : text.includes(q);
    });
  }

  get displayValue(): string {
    const v = this.currentValue();
    if (v === null || v === undefined || v === '') return '';
    const item = (this.dataSource ?? []).find(i => this.getVal(i) === v);
    return item ? this.getDisp(item) : String(v);
  }

  get hasValue(): boolean {
    const v = this.currentValue();
    return v !== null && v !== undefined && v !== '';
  }

  getDisp(item: any): string {
    if (item === null || item === undefined) return '';
    if (typeof this.displayExpr === 'function') return this.displayExpr(item);
    return String(item[(this.displayExpr as string)] ?? '');
  }

  getVal(item: any): any {
    if (item === null || item === undefined) return null;
    return this.valueExpr ? item[this.valueExpr] : item;
  }

  toggleDropdown() {
    this.open.update(v => !v);
    if (this.open() && this.searchEnabled) {
      setTimeout(() => this.searchInputRef?.nativeElement.focus(), 30);
    }
    this._onTouched();
  }

  selectItem(item: any) {
    const prev = this.currentValue();
    const next = this.getVal(item);
    this.currentValue.set(next);
    this._onChange(next);
    this.onValueChanged.emit({ value: next, previousValue: prev });
    this.open.set(false);
    this.searchText.set('');
  }

  clear(event: MouseEvent) {
    event.stopPropagation();
    const prev = this.currentValue();
    this.currentValue.set(null);
    this._onChange(null);
    this.onValueChanged.emit({ value: null, previousValue: prev });
    this.open.set(false);
  }

  onSearch(event: Event) {
    this.searchText.set((event.target as HTMLInputElement).value);
  }

  @HostListener('document:click', ['$event'])
  onDocClick(event: MouseEvent) {
    if (!this.open()) return;
    const host = (event.target as HTMLElement).closest('app-select-box');
    if (!host) { this.open.set(false); this.searchText.set(''); }
  }

  // ── ControlValueAccessor ───────────────────────────────────────
  writeValue(v: any) { this.currentValue.set(v ?? null); }
  registerOnChange(fn: any) { this._onChange = fn; }
  registerOnTouched(fn: any) { this._onTouched = fn; }
  setDisabledState(d: boolean) { this.disabled = d; }
}
