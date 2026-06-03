import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * app-tab-item — Tab content pane (used inside app-tab-panel)
 *
 * Usage:
 *   <app-tab-item title="แท็บ 1">
 *     <!-- เนื้อหาแท็บ -->
 *   </app-tab-item>
 */
@Component({
  selector: 'app-tab-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [style.display]="active ? 'block' : 'none'">
      <ng-content></ng-content>
    </div>
  `,
})
export class TabItemComponent {
  @Input() title = '';
  @Input() disabled = false;
  /** Set by parent TabPanelComponent */
  active = false;
}
