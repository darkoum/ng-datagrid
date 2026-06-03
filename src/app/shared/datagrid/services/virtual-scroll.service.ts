import { Injectable, signal, computed } from '@angular/core';

export interface VirtualScrollConfig {
  itemHeight: number;
  bufferSize: number;
  containerHeight: number;
}

@Injectable()
export class VirtualScrollService {
  config: VirtualScrollConfig = { itemHeight: 40, bufferSize: 5, containerHeight: 400 };

  readonly scrollTop  = signal(0);
  readonly totalItems = signal(0);

  readonly visibleRange = computed(() => {
    const { itemHeight, bufferSize, containerHeight } = this.config;
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const startIdx     = Math.max(0, Math.floor(this.scrollTop() / itemHeight) - bufferSize);
    const endIdx       = Math.min(this.totalItems() - 1, startIdx + visibleCount + bufferSize * 2);
    return { startIdx, endIdx, visibleCount };
  });

  readonly totalHeight = computed(() =>
    this.totalItems() * this.config.itemHeight
  );

  readonly offsetY = computed(() =>
    this.visibleRange().startIdx * this.config.itemHeight
  );

  configure(cfg: Partial<VirtualScrollConfig>): void {
    this.config = { ...this.config, ...cfg };
  }

  onScroll(scrollTop: number): void {
    this.scrollTop.set(scrollTop);
  }

  getVisibleItems<T>(items: T[]): T[] {
    const { startIdx, endIdx } = this.visibleRange();
    return items.slice(startIdx, endIdx + 1);
  }
}
