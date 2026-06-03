import {
  Component, Input, Output, EventEmitter, ContentChildren,
  QueryList, AfterContentInit, OnChanges, SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionItemComponent } from './accordion-item.component';

export interface AccordionSelectionChangedEvent {
  selectedIndex: number;
  addedItems: any[];
  removedItems: any[];
}

/**
 * app-accordion — Drop-in replacement for dx-accordion
 *
 * Usage:
 *   <app-accordion
 *     [multiple]="false"
 *     [collapsible]="true"
 *     (onSelectionChanged)="fn($event)">
 *
 *     <app-accordion-item title="หัวข้อ 1">
 *       <!-- เนื้อหา -->
 *     </app-accordion-item>
 *
 *     <app-accordion-item title="หัวข้อ 2">
 *       <!-- เนื้อหา -->
 *     </app-accordion-item>
 *
 *   </app-accordion>
 *
 * Note: เปลี่ยนจาก <dxi-item title="..."> เป็น <app-accordion-item title="...">
 */
@Component({
  selector: 'app-accordion',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="app-acc">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .app-acc {
      border: 1px solid #dee2e6; border-radius: 4px; overflow: hidden;
    }
  `],
})
export class AccordionComponent implements AfterContentInit, OnChanges {
  /** Allow multiple panels open simultaneously */
  @Input() multiple = false;
  /** Allow collapsing the last open panel */
  @Input() collapsible = true;
  /** Open the Nth item by default (0-based) */
  @Input() selectedIndex = 0;
  @Input() animationEnabled = true;

  @Output() onSelectionChanged = new EventEmitter<AccordionSelectionChangedEvent>();

  @ContentChildren(AccordionItemComponent) items!: QueryList<AccordionItemComponent>;

  ngAfterContentInit() {
    this.bindToggleCallbacks();
    // Open default
    if (this.items.length > 0) {
      this.items.get(this.selectedIndex)!.open = true;
    }
    this.items.changes.subscribe(() => this.bindToggleCallbacks());
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedIndex'] && this.items) {
      this.items.forEach((item, i) => (item.open = i === this.selectedIndex));
    }
  }

  private bindToggleCallbacks() {
    this.items.forEach(item => {
      item.onToggle = (clicked) => this.handleToggle(clicked);
    });
  }

  private handleToggle(clicked: AccordionItemComponent) {
    const wasOpen = clicked.open;
    const clickedIndex = this.items.toArray().indexOf(clicked);

    if (!this.multiple) {
      // Close all others
      const prev = this.items.toArray().filter(i => i.open && i !== clicked);
      this.items.forEach(i => (i.open = false));

      if (!wasOpen || !this.collapsible) {
        clicked.open = true;
      }

      this.onSelectionChanged.emit({
        selectedIndex: clickedIndex,
        addedItems:   [clicked],
        removedItems: prev,
      });
    } else {
      clicked.open = !wasOpen;
      this.onSelectionChanged.emit({
        selectedIndex: clickedIndex,
        addedItems:   clicked.open ? [clicked] : [],
        removedItems: clicked.open ? [] : [clicked],
      });
    }
  }
}
