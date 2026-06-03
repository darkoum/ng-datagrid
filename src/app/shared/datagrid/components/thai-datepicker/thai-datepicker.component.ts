import {
  Component, Input, Output, EventEmitter, OnInit,
  forwardRef, signal, computed, HostListener, ElementRef, inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ThaiDateFormat } from '../../models/datagrid.types';

const MONTHS_FULL  = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];
const MONTHS_SHORT = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];

@Component({
  selector: 'app-thai-datepicker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './thai-datepicker.component.html',
  styleUrls: ['./thai-datepicker.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ThaiDatepickerComponent),
    multi: true,
  }],
})
export class ThaiDatepickerComponent implements OnInit, ControlValueAccessor {
  @Input() placeholder = 'วว/ดด/ปปปป';
  @Input() format: ThaiDateFormat = 'shortDate';
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() min?: Date;
  @Input() max?: Date;
  @Input() showTime = false;
  @Input() cssClass = '';

  @Output() valueChange = new EventEmitter<Date | null>();
  @Output() opened      = new EventEmitter<void>();
  @Output() closed      = new EventEmitter<void>();

  inputText    = signal('');
  isOpen       = signal(false);
  isValid      = signal(true);
  viewYear     = signal(new Date().getFullYear() + 543);
  viewMonth    = signal(new Date().getMonth());
  selectedDate = signal<Date | null>(null);
  /** 'day' | 'month' | 'year' */
  viewMode     = signal<'day' | 'month' | 'year'>('day');
  /** ปีเริ่มต้นของ year grid (แสดง 12 ปี) */
  yearRangeStart = signal(Math.floor((new Date().getFullYear() + 543) / 12) * 12);
  /** position: fixed coordinates — หนีจาก overflow:hidden ของ datagrid */
  popupTop  = signal('0px');
  popupLeft = signal('0px');

  calendarDays  = computed(() => this.buildCalendar(this.viewYear(), this.viewMonth()));
  displayMonth  = computed(() => `${MONTHS_FULL[this.viewMonth()]} ${this.viewYear()}`);
  yearRangeList = computed(() => {
    const s = this.yearRangeStart();
    return Array.from({ length: 12 }, (_, i) => s + i);
  });

  private onChange: (v: any) => void = () => {};
  private onTouched: () => void = () => {};
  private el = inject(ElementRef);

  readonly MONTHS_SHORT = MONTHS_SHORT;
  readonly MONTHS_FULL  = MONTHS_FULL;
  readonly DAYS_HEADER  = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];
  // keep old alias for template compat
  readonly MONTHS       = MONTHS_FULL;

  writeValue(value: Date | string | null): void {
    if (!value) {
      this.inputText.set('');
      this.selectedDate.set(null);
      return;
    }
    const date = value instanceof Date ? value : new Date(value);
    if (!isNaN(date.getTime())) {
      this.selectedDate.set(date);
      this.inputText.set(this.formatDate(date));
      this.viewYear.set(date.getFullYear() + 543);
      this.viewMonth.set(date.getMonth());
    }
  }

  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { this.disabled = isDisabled; }

  ngOnInit(): void {}

  onInputChange(text: string): void {
    this.inputText.set(text);
    const cleaned = text.replace(/\D/g, '');
    if (this.format === 'shortDate') {
      let formatted = cleaned;
      if (cleaned.length > 2) formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2);
      if (cleaned.length > 4) formatted = formatted.slice(0, 5) + '/' + cleaned.slice(4, 8);
      if (formatted !== text)  this.inputText.set(formatted);
    }

    const parsed = this.parseInput(text);
    if (parsed) {
      this.isValid.set(true);
      this.selectedDate.set(parsed);
      this.viewYear.set(parsed.getFullYear() + 543);
      this.viewMonth.set(parsed.getMonth());
      this.onChange(parsed);
      this.valueChange.emit(parsed);
    } else {
      this.isValid.set(text.length === 0);
      if (text.length === 0) {
        this.selectedDate.set(null);
        this.onChange(null);
        this.valueChange.emit(null);
      }
    }
  }

  onInputFocus(): void {
    // _suppressReopen ป้องกัน calendar reopen หลัง selectDay ทำให้ input refocus
    if (!this.readonly && !this._suppressReopen) this.openCalendar();
  }

  onInputBlur(): void {
    this.onTouched();
    const parsed = this.parseInput(this.inputText());
    if (parsed) this.inputText.set(this.formatDate(parsed));
  }

  // ป้องกัน input focus ที่เกิดจากการ click วันที่แล้ว reopen calendar
  private _suppressReopen = false;

  openCalendar(): void {
    if (this.disabled || this.readonly) return;
    this.viewMode.set('day');  // เสมอเริ่มจาก day view
    this._updatePopupPosition();
    this.isOpen.set(true);
    this.opened.emit();
  }

  private _updatePopupPosition(): void {
    // getBoundingClientRect() คืน viewport coordinates → ใช้กับ position:fixed โดยตรง
    const rect = this.el.nativeElement.getBoundingClientRect();
    const popupH = 360;
    const popupW = 282;

    // เปิดด้านล่างถ้ามีพื้นที่ มิฉะนั้นเปิดขึ้นบน
    const spaceBelow = window.innerHeight - rect.bottom - 4;
    const top = spaceBelow >= popupH
      ? rect.bottom + 4
      : Math.max(4, rect.top - popupH - 4);

    // อย่าล้นขอบขวา
    const left = Math.min(rect.left, window.innerWidth - popupW - 8);

    this.popupTop.set(`${top}px`);
    this.popupLeft.set(`${Math.max(4, left)}px`);
  }

  closeCalendar(): void {
    this._suppressReopen = true;
    this.isOpen.set(false);
    this.closed.emit();
    // หลัง 300ms ให้ focus event ทำงานได้ปกติอีกครั้ง
    setTimeout(() => (this._suppressReopen = false), 300);
  }

  prevMonth(): void {
    if (this.viewMonth() === 0) {
      this.viewMonth.set(11);
      this.viewYear.update(y => y - 1);
    } else {
      this.viewMonth.update(m => m - 1);
    }
  }

  nextMonth(): void {
    if (this.viewMonth() === 11) {
      this.viewMonth.set(0);
      this.viewYear.update(y => y + 1);
    } else {
      this.viewMonth.update(m => m + 1);
    }
  }

  prevYear(): void {
    if (this.viewMode() === 'year') this.yearRangeStart.update(s => s - 12);
    else this.viewYear.update(y => y - 1);
  }
  nextYear(): void {
    if (this.viewMode() === 'year') this.yearRangeStart.update(s => s + 12);
    else this.viewYear.update(y => y + 1);
  }

  // ── View switching ─────────────────────────────────────────────────────────
  toggleMonthView(): void {
    this.viewMode.set(this.viewMode() === 'month' ? 'day' : 'month');
  }

  toggleYearView(): void {
    if (this.viewMode() === 'year') {
      this.viewMode.set('day');
    } else {
      // จัด yearRangeStart ให้ครอบคลุมปีปัจจุบัน
      const y = this.viewYear();
      this.yearRangeStart.set(Math.floor(y / 12) * 12);
      this.viewMode.set('year');
    }
  }

  selectMonth(monthIndex: number): void {
    this.viewMonth.set(monthIndex);
    this.viewMode.set('day');
  }

  selectYear(year: number): void {
    this.viewYear.set(year);
    this.viewMode.set('month');
  }

  isSelectedMonth(m: number): boolean {
    const sel = this.selectedDate();
    return !!sel && sel.getMonth() === m && (sel.getFullYear() + 543) === this.viewYear();
  }

  isSelectedYear(y: number): boolean {
    const sel = this.selectedDate();
    return !!sel && (sel.getFullYear() + 543) === y;
  }

  isCurrentYear(y: number): boolean {
    return y === new Date().getFullYear() + 543;
  }

  isCurrentMonth(m: number): boolean {
    const now = new Date();
    return m === now.getMonth() && this.viewYear() === now.getFullYear() + 543;
  }

  selectDay(day: CalendarDay): void {
    if (!day.date || day.disabled) return;
    this.selectedDate.set(day.date);
    this.inputText.set(this.formatDate(day.date));
    this.isValid.set(true);
    this.onChange(day.date);
    this.valueChange.emit(day.date);
    if (!this.showTime) this.closeCalendar();
  }

  selectToday(): void {
    const today = new Date();
    this.selectDay({
      date: today, day: today.getDate(), currentMonth: true,
      disabled: false, isToday: true, isSelected: false, isSunday: today.getDay() === 0,
    });
  }

  clearDate(): void {
    this.selectedDate.set(null);
    this.inputText.set('');
    this.isValid.set(true);
    this.onChange(null);
    this.valueChange.emit(null);
    this.closeCalendar();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(e: MouseEvent): void {
    if (!this.el.nativeElement.contains(e.target)) this.closeCalendar();
  }

  isSelectedDay(day: CalendarDay): boolean {
    const sel = this.selectedDate();
    if (!sel || !day.date) return false;
    return sel.getDate()     === day.date.getDate() &&
           sel.getMonth()    === day.date.getMonth() &&
           sel.getFullYear() === day.date.getFullYear();
  }

  private buildCalendar(thaiYear: number, month: number): CalendarDay[][] {
    const year     = thaiYear - 543;
    const today    = new Date();
    const first    = new Date(year, month, 1);
    const last     = new Date(year, month + 1, 0);
    const startDow = first.getDay();

    const days: CalendarDay[] = [];

    for (let i = 0; i < startDow; i++) {
      const d = new Date(year, month, -startDow + i + 1);
      days.push({ date: d, day: d.getDate(), currentMonth: false,
                  disabled: true, isToday: false, isSelected: false, isSunday: d.getDay() === 0 });
    }

    for (let d = 1; d <= last.getDate(); d++) {
      const date     = new Date(year, month, d);
      const disabled = (this.min && date < this.min) || (this.max && date > this.max) || false;
      const isToday  = date.toDateString() === today.toDateString();
      days.push({ date, day: d, currentMonth: true, disabled,
                  isToday, isSelected: false, isSunday: date.getDay() === 0 });
    }

    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(year, month + 1, i);
      days.push({ date: d, day: i, currentMonth: false,
                  disabled: true, isToday: false, isSelected: false, isSunday: d.getDay() === 0 });
    }

    const weeks: CalendarDay[][] = [];
    for (let i = 0; i < 6; i++) weeks.push(days.slice(i * 7, (i + 1) * 7));
    return weeks;
  }

  private formatDate(date: Date): string {
    const d   = date.getDate();
    const m   = date.getMonth();
    const y   = date.getFullYear() + 543;
    const dd2 = String(d).padStart(2, '0');
    const mm2 = String(m + 1).padStart(2, '0');
    const yS  = String(y).slice(-2);

    switch (this.format) {
      case 'shortDate':  return `${dd2}/${mm2}/${y}`;
      case 'short':      return `${d} ${MONTHS_SHORT[m]} ${yS}`;
      case 'mediumDate': return `${d} ${MONTHS_SHORT[m]} ${y}`;
      case 'medium':     return `${d} ${MONTHS_FULL[m]} ${y}`;
      default:           return `${dd2}/${mm2}/${y}`;
    }
  }

  private parseInput(text: string): Date | null {
    if (!text || text.length < 8) return null;

    const parts = text.split('/');
    if (parts.length === 3) {
      const d = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10) - 1;
      let y   = parseInt(parts[2], 10);

      if (y < 100) y += 2500;
      if (y > 2400) y -= 543;

      const date = new Date(y, m, d);
      if (!isNaN(date.getTime()) && date.getDate() === d) return date;
    }

    const thaiPattern = /^(\d{1,2})\s+([฀-๿.]+)\s+(\d{2,4})$/;
    const match = text.match(thaiPattern);
    if (match) {
      const d    = parseInt(match[1], 10);
      const mStr = match[2];
      let y      = parseInt(match[3], 10);
      if (y < 100)  y += 2500;
      if (y > 2400) y -= 543;

      const mIdx = [...MONTHS_FULL, ...MONTHS_SHORT].findIndex(n =>
        n === mStr || n.replace(/\./g, '') === mStr.replace(/\./g, '')
      ) % 12;

      if (mIdx >= 0) {
        const date = new Date(y, mIdx, d);
        if (!isNaN(date.getTime())) return date;
      }
    }

    return null;
  }
}

interface CalendarDay {
  date: Date | null;
  day: number;
  currentMonth: boolean;
  disabled: boolean;
  isToday: boolean;
  isSelected: boolean;
  isSunday: boolean;
}
