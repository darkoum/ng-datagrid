import {
  Component, Input, Output, EventEmitter, forwardRef,
  signal, computed, ViewChild, ElementRef, HostListener, OnChanges,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface TbxValueChangedEvent {
  value: any[];
  previousValue: any[];
  addedItems: any[];
  removedItems: any[];
}

/**
 * app-tag-box — Drop-in replacement for dx-tag-box (multi-select)
 *
 * Usage:
 *   <app-tag-box
 *     [dataSource]="myList"
 *     displayExpr="name"
 *     valueExpr="id"
 *     [searchEnabled]="true"
 *     [showClearButton]="true"
 *     [(ngModel)]="selectedIds"
 *     (onValueChanged)="fn($event)">
 *   </app-tag-box>
 */
@Component({
  selector: 'app-tag-box',
  standalone: true,
  imports: [CommonModule],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TagBoxComponent),
    multi: true,
  }],
  template: `
    <div class="app-tbx" [class.app-tbx--disabled]="disabled" [class.app-tbx--open]="open()">

      <!-- ─── Trigger / Tags ──────────────────────────────────────── -->
      <div class="app-tbx__control" (click)="!disabled && toggleDropdown()">
        <!-- selected tags -->
        <div class="app-tbx__tags">
          @for (v of selectedValues(); track v) {
            <span class="app-tbx__tag">
              {{ getDisplayByValue(v) }}
              <button type="button" class="app-tbx__tag-remove"
                      (click)="removeTag(v, $event)">✕</button>
            </span>
          }
          <!-- inline search -->
          @if (searchEnabled && open()) {
            <input #searchInput class="app-tbx__inline-search"
                   type="text"
                   [value]="searchText()"
                   (input)="onSearch($event)"
                   (click)="$event.stopPropagation()"
                   placeholder="">
          }
          @if (!selectedValues().length && (!searchEnabled || !open())) {
            <span class="app-tbx__ph">{{ placeholder }}</span>
          }
        </div>
        <div class="app-tbx__icons">
          @if (showClearButton && selectedValues().length) {
            <button class="app-tbx__clear" type="button" (click)="clearAll($event)">✕</button>
          }
          <span class="app-tbx__arrow">▾</span>
        </div>
      </div>

      <!-- ─── Dropdown ─────────────────────────────────────────────── -->
      @if (open()) {
        <div class="app-tbx__dropdown">
          @if (searchEnabled && !open()) {
            <div class="app-tbx__search-wrap">
              <input #searchInput class="app-tbx__search"
                     type="text"
                     [value]="searchText()"
                     (input)="onSearch($event)"
                     (click)="$event.stopPropagation()"
                     placeholder="ค้นหา...">
            </div>
          }
          <div class="app-tbx__list">
            @for (item of filteredItems(); track getVal(item)) {
              <div class="app-tbx__item"
                   [class.app-tbx__item--selected]="isSelected(getVal(item))"
                   (click)="toggleItem(item, $event)">
                <span class="app-tbx__item-check">{{ isSelected(getVal(item)) ? '✓' : '' }}</span>
                {{ getDisp(item) }}
              </div>
            }
            @if (!filteredItems().length) {
              <div class="app-tbx__empty">ไม่พบข้อมูล</div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }

    .app-tbx { position: relative; font-size: 14px; }

    .app-tbx__control {
      display: flex; align-items: flex-start; justify-content: space-between;
      border: 1px solid #ced4da; border-radius: 4px; padding: 4px 8px;
      background: #fff; cursor: pointer; min-height: 34px; user-select: none;
      gap: 4px; transition: border-color .15s;
    }
    .app-tbx--open .app-tbx__control,
    .app-tbx__control:hover { border-color: #86b7fe; }
    .app-tbx--disabled .app-tbx__control { background: #e9ecef; cursor: not-allowed; }

    .app-tbx__tags {
      flex: 1; display: flex; flex-wrap: wrap; gap: 4px; min-height: 24px; align-items: center;
    }

    .app-tbx__tag {
      display: inline-flex; align-items: center; gap: 4px;
      background: #e3f0ff; color: #0d6efd; border-radius: 3px;
      padding: 2px 6px; font-size: 12px; line-height: 1.4;
    }
    .app-tbx__tag-remove {
      background: none; border: none; cursor: pointer; color: inherit;
      font-size: 10px; padding: 0; line-height: 1; opacity: .7;
    }
    .app-tbx__tag-remove:hover { opacity: 1; }

    .app-tbx__ph { color: #adb5bd; line-height: 24px; }

    .app-tbx__inline-search {
      border: none; outline: none; font-size: 14px;
      background: transparent; min-width: 60px; flex: 1;
    }

    .app-tbx__icons {
      display: flex; align-items: center; gap: 3px; flex-shrink: 0; align-self: center;
    }
    .app-tbx__clear {
      background: none; border: none; cursor: pointer; color: #adb5bd;
      font-size: 11px; padding: 0 2px;
    }
    .app-tbx__clear:hover { color: #495057; }
    .app-tbx__arrow { color: #adb5bd; font-size: 11px; transition: transform .2s; }
    .app-tbx--open .app-tbx__arrow { transform: rotate(180deg); }

    .app-tbx__dropdown {
      position: absolute; top: calc(100% + 2px); left: 0; right: 0; z-index: 1050;
      background: #fff; border: 1px solid #dee2e6; border-radius: 4px;
      box-shadow: 0 4px 12px rgba(0,0,0,.12);
    }

    .app-tbx__search-wrap { padding: 6px 8px; border-bottom: 1px solid #f0f0f0; }
    .app-tbx__search {
      width: 100%; border: 1px solid #dee2e6; border-radius: 3px;
      padding: 4px 8px; font-size: 13px; outline: none; box-sizing: border-box;
    }
    .app-tbx__search:focus { border-color: #86b7fe; }

    .app-tbx__list { max-height: 220px; overflow-y: auto; }

    .app-tbx__item {
      display: flex; align-items: center; gap: 8px;
      padding: 7px 12px; cursor: pointer; font-size: 14px;
    }
    .app-tbx__item:hover { background: #f0f7ff; }
    .app-tbx__item--selected { background: #e3f0ff; }

    .app-tbx__item-check {
      width: 14px; flex-shrink: 0; color: #0d6efd; font-size: 12px; font-weight: 700;
    }

    .app-tbx__empty { padding: 10px 12px; color: #adb5bd; font-size: 13px; }
  `],
})
export class TagBoxComponent implements ControlValueAccessor, OnChanges {
  @Input() dataSource: any[] = [];
  @Input() displayExpr: string | ((item: any) => string) = 'name';
  @Input() valueExpr: string = 'id';
  @Input() searchEnabled = false;
  @Input() showClearButton = false;
  @Input() placeholder = 'เลือก...';
  @Input() disabled = false;
  @Input() searchMode: 'contains' | 'startsWith' = 'contains';
  @Input() maxDisplayedTags?: number;
  @Input() showSelectionControls = false;

  @Output() onValueChanged = new EventEmitter<TbxValueChangedEvent>();

  @ViewChild('searchInput') searchInputRef?: ElementRef<HTMLInputElement>;

  open = signal(false);
  searchText = signal('');
  selectedValues = signal<any[]>([]);

  private _onChange: (v: any) => void = () => {};
  private _onTouched: () => void = () => {};

  ngOnChanges() { /* trigger recompute */ }

  readonly filteredItems = computed<any[]>(() => {
    const q = this.searchText().toLowerCase();
    const src = this.dataSource ?? [];
    if (!q) return src;
    const mode = this.searchMode.toLowerCase();
    return src.filter(item => {
      const text = this.getDisp(item).toLowerCase();
      return mode === 'startswith' ? text.startsWith(q) : text.includes(q);
    });
  });

  getDisp(item: any): string {
    if (item === null || item === undefined) return '';
    if (typeof this.displayExpr === 'function') return this.displayExpr(item);
    return String(item[this.displayExpr as string] ?? '');
  }

  getVal(item: any): any {
    if (item === null || item === undefined) return null;
    return this.valueExpr ? item[this.valueExpr] : item;
  }

  getDisplayByValue(val: any): string {
    const item = (this.dataSource ?? []).find(i => this.getVal(i) === val);
    return item ? this.getDisp(item) : String(val);
  }

  isSelected(val: any): boolean {
    return this.selectedValues().includes(val);
  }

  toggleItem(item: any, event: MouseEvent) {
    event.stopPropagation();
    const v = this.getVal(item);
    const prev = [...this.selectedValues()];
    let next: any[];
    let addedItems: any[] = [];
    let removedItems: any[] = [];

    if (this.isSelected(v)) {
      next = prev.filter(x => x !== v);
      removedItems = [v];
    } else {
      next = [...prev, v];
      addedItems = [v];
    }
    this.selectedValues.set(next);
    this._onChange(next);
    this.onValueChanged.emit({ value: next, previousValue: prev, addedItems, removedItems });
  }

  removeTag(val: any, event: MouseEvent) {
    event.stopPropagation();
    const prev = [...this.selectedValues()];
    const next = prev.filter(x => x !== val);
    this.selectedValues.set(next);
    this._onChange(next);
    this.onValueChanged.emit({ value: next, previousValue: prev, addedItems: [], removedItems: [val] });
  }

  clearAll(event: MouseEvent) {
    event.stopPropagation();
    const prev = [...this.selectedValues()];
    this.selectedValues.set([]);
    this._onChange([]);
    this.onValueChanged.emit({ value: [], previousValue: prev, addedItems: [], removedItems: prev });
  }

  onSearch(event: Event) {
    this.searchText.set((event.target as HTMLInputElement).value);
  }

  toggleDropdown() {
    this.open.update(v => !v);
    if (this.open() && this.searchEnabled) {
      setTimeout(() => this.searchInputRef?.nativeElement.focus(), 30);
    }
    this._onTouched();
  }

  @HostListener('document:click', ['$event'])
  onDocClick(event: MouseEvent) {
    if (!this.open()) return;
    const host = (event.target as HTMLElement).closest('app-tag-box');
    if (!host) { this.open.set(false); this.searchText.set(''); }
  }

  // ── ControlValueAccessor ───────────────────────────────────────
  writeValue(v: any): void { this.selectedValues.set(Array.isArray(v) ? v : []); }
  registerOnChange(fn: any): void { this._onChange = fn; }
  registerOnTouched(fn: any): void { this._onTouched = fn; }
  setDisabledState(d: boolean): void { this.disabled = d; }
}
