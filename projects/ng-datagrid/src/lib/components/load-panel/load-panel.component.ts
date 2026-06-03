import {
  Component, Input, Output, EventEmitter, HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * app-load-panel — Drop-in replacement for dx-load-panel
 *
 * Usage:
 *   <app-load-panel
 *     [(visible)]="loadingVisible"
 *     shadingColor="rgba(0,0,0,0.4)"
 *     [shading]="true"
 *     [closeOnOutsideClick]="false"
 *     message="กำลังโหลด...">
 *   </app-load-panel>
 */
@Component({
  selector: 'app-load-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (visible) {
      <!-- Shading overlay -->
      @if (shading) {
        <div class="app-lp__shading"
             [style.background]="shadingColor"
             (click)="closeOnOutsideClick && hide()">
        </div>
      }
      <!-- Panel -->
      <div class="app-lp__panel" role="status" aria-live="polite">
        @if (showIndicator) {
          <div class="app-lp__spinner">
            <div class="app-lp__ring"></div>
          </div>
        }
        @if (message || showPane) {
          <div class="app-lp__msg">{{ message || 'Loading...' }}</div>
        }
      </div>
    }
  `,
  styles: [`
    :host { /* host must be in DOM always — contents are conditional */ }

    .app-lp__shading {
      position: fixed; inset: 0; z-index: 1060;
    }

    .app-lp__panel {
      position: fixed; top: 50%; left: 50%; z-index: 1061;
      transform: translate(-50%, -50%);
      background: #fff; border-radius: 6px;
      padding: 20px 32px; box-shadow: 0 4px 20px rgba(0,0,0,.25);
      display: flex; flex-direction: column; align-items: center; gap: 12px;
      min-width: 120px;
    }

    .app-lp__spinner { display: flex; align-items: center; justify-content: center; }

    .app-lp__ring {
      width: 36px; height: 36px;
      border: 4px solid #dee2e6;
      border-top-color: #0d6efd;
      border-radius: 50%;
      animation: app-lp-spin .75s linear infinite;
    }
    @keyframes app-lp-spin {
      to { transform: rotate(360deg); }
    }

    .app-lp__msg {
      font-size: 14px; color: #495057; white-space: nowrap;
    }
  `],
})
export class LoadPanelComponent {
  @Input() visible = false;
  @Input() shadingColor = 'rgba(0,0,0,0.35)';
  @Input() shading = true;
  @Input() showIndicator = true;
  @Input() showPane = true;
  @Input() closeOnOutsideClick = false;
  @Input() message = '';

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() onHiding = new EventEmitter<void>();

  hide() {
    this.visible = false;
    this.visibleChange.emit(false);
    this.onHiding.emit();
  }
}
