import { Component, inject } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-docs',
  standalone: true,
  imports: [],
  template: `<iframe [src]="docsUrl" class="docs-iframe" title="คู่มือการใช้งาน"></iframe>`,
  styles: [`:host{display:block;height:calc(100vh - 52px);margin:-24px}
    .docs-iframe{width:100%;height:100%;border:none;display:block}`],
})
export class DocsComponent {
  private base    = inject(APP_BASE_HREF, { optional: true }) ?? '/';
  private san     = inject(DomSanitizer);
  readonly docsUrl: SafeResourceUrl = this.san.bypassSecurityTrustResourceUrl(
    this.base.replace(/\/$/, '') + '/assets/api-docs.html'
  );
}
