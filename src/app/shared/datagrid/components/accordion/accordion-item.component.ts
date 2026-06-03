import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * app-accordion-item — Single collapsible panel (used inside app-accordion)
 *
 * Usage:
 *   <app-accordion-item title="หัวข้อ">
 *     <!-- เนื้อหา -->
 *   </app-accordion-item>
 */
@Component({
  selector: 'app-accordion-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="app-acc-item" [class.app-acc-item--open]="open">
      <button class="app-acc-item__header" type="button" (click)="toggle()">
        <span class="app-acc-item__title">{{ title }}</span>
        <span class="app-acc-item__arrow">{{ open ? '▲' : '▼' }}</span>
      </button>
      <div class="app-acc-item__body" [style.display]="open ? 'block' : 'none'">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .app-acc-item { border-bottom: 1px solid #dee2e6; }
    .app-acc-item:last-child { border-bottom: none; }

    .app-acc-item__header {
      width: 100%; display: flex; align-items: center; justify-content: space-between;
      padding: 12px 16px; background: #f8f9fa; border: none; cursor: pointer;
      text-align: left; font-size: 14px; color: #212529;
      transition: background .15s;
    }
    .app-acc-item--open .app-acc-item__header { background: #e9ecef; }
    .app-acc-item__header:hover { background: #e2e6ea; }

    .app-acc-item__title { flex: 1; font-weight: 500; }
    .app-acc-item__arrow { color: #6c757d; font-size: 11px; margin-left: 8px; }

    .app-acc-item__body { padding: 12px 16px; background: #fff; }
  `],
})
export class AccordionItemComponent {
  @Input() title = '';
  @Input() disabled = false;
  /** Controlled by parent AccordionComponent */
  open = false;

  /** Callback set by parent */
  onToggle?: (item: AccordionItemComponent) => void;

  toggle() {
    if (this.disabled) return;
    if (this.onToggle) this.onToggle(this);
    else this.open = !this.open;
  }
}
