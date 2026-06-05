import { Component, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
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
  private doc = inject(DOCUMENT);
  private san = inject(DomSanitizer);

  readonly docsUrl: SafeResourceUrl = (() => {
    // อ่าน base href จาก <base> tag ใน index.html (รองรับ --base-href /ng-datagrid/)
    const baseHref = this.doc.querySelector('base')?.getAttribute('href') ?? '/';
    const base = baseHref.replace(/\/$/, '');
    return this.san.bypassSecurityTrustResourceUrl(base + '/assets/api-docs.html');
  })();
}
