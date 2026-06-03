import {
  Component, Input, Output, EventEmitter, ContentChildren,
  QueryList, AfterContentInit, OnChanges, SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabItemComponent } from './tab-item.component';

export interface TabSelectionChangedEvent {
  selectedIndex: number;
  addedItems: any[];
  removedItems: any[];
}

/**
 * app-tab-panel — Drop-in replacement for dx-tab-panel
 *
 * Usage:
 *   <app-tab-panel
 *     [selectedIndex]="0"
 *     (onSelectionChanged)="Changedpanel($event)">
 *
 *     <app-tab-item title="สิทธิ์ในการดูข้อมูล">
 *       <!-- content -->
 *     </app-tab-item>
 *
 *     <app-tab-item title="ตำแหน่งบริหาร">
 *       <!-- content -->
 *     </app-tab-item>
 *
 *   </app-tab-panel>
 *
 * Note: เปลี่ยนจาก <dxi-item title="..."> เป็น <app-tab-item title="...">
 */
@Component({
  selector: 'app-tab-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="app-tabs">
      <!-- Tab Headers -->
      <ul class="app-tabs__nav" role="tablist">
        @for (item of items; track $index) {
          <li class="app-tabs__nav-item" role="presentation">
            <button class="app-tabs__tab"
                    [class.active]="selectedIndex === $index"
                    [class.disabled]="item.disabled"
                    role="tab"
                    [attr.aria-selected]="selectedIndex === $index"
                    type="button"
                    (click)="!item.disabled && select($index)">
              {{ item.title }}
            </button>
          </li>
        }
      </ul>

      <!-- Tab Content (rendered by TabItemComponent itself via [style.display]) -->
      <div class="app-tabs__content">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .app-tabs { border: 1px solid #dee2e6; border-radius: 4px; overflow: hidden; }

    .app-tabs__nav {
      display: flex; flex-wrap: wrap; list-style: none; margin: 0; padding: 0;
      background: #f8f9fa; border-bottom: 1px solid #dee2e6;
    }

    .app-tabs__nav-item { flex-shrink: 0; }

    .app-tabs__tab {
      display: block; padding: 10px 18px;
      background: transparent; border: none; border-bottom: 3px solid transparent;
      cursor: pointer; font-size: 14px; color: #6c757d;
      transition: color .15s, border-color .15s;
      white-space: nowrap; user-select: none;
    }
    .app-tabs__tab:hover:not(.disabled) { color: #212529; background: #e9ecef; }
    .app-tabs__tab.active {
      color: #0d6efd; border-bottom-color: #0d6efd;
      background: #fff; font-weight: 500;
    }
    .app-tabs__tab.disabled { opacity: .5; cursor: not-allowed; }

    .app-tabs__content { padding: 16px; background: #fff; }
  `],
})
export class TabPanelComponent implements AfterContentInit, OnChanges {
  @Input() selectedIndex = 0;
  @Input() animationEnabled = true;
  @Input() swipeEnabled = false;

  @Output() onSelectionChanged = new EventEmitter<TabSelectionChangedEvent>();
  @Output() selectedIndexChange = new EventEmitter<number>();

  @ContentChildren(TabItemComponent) items!: QueryList<TabItemComponent>;

  ngAfterContentInit() {
    this.syncActive();
    this.items.changes.subscribe(() => this.syncActive());
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedIndex'] && this.items) {
      this.syncActive();
    }
  }

  select(index: number) {
    const prev = this.selectedIndex;
    this.selectedIndex = index;
    this.selectedIndexChange.emit(index);
    this.syncActive();
    this.onSelectionChanged.emit({
      selectedIndex: index,
      addedItems:   [this.items.get(index)],
      removedItems: [this.items.get(prev)],
    });
  }

  private syncActive() {
    if (!this.items) return;
    this.items.forEach((item, i) => (item.active = i === this.selectedIndex));
  }
}
