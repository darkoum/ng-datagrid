import { Pipe, PipeTransform } from '@angular/core';
import { ThaiDateFormat } from '../models/datagrid.types';

const MONTHS_FULL  = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];
const MONTHS_SHORT = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];
const DAYS_FULL    = ['อาทิตย์','จันทร์','อังคาร','พุธ','พฤหัสบดี','ศุกร์','เสาร์'];

@Pipe({ name: 'thaiDate', standalone: true, pure: true })
export class ThaiDatePipe implements PipeTransform {
  transform(value: any, format: ThaiDateFormat = 'medium'): string {
    if (!value) return '-';
    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) return String(value);

    const d    = date.getDate();
    const m    = date.getMonth();
    const y    = date.getFullYear() + 543;
    const yS   = String(y).slice(-2);
    const dow  = date.getDay();
    const dd2  = String(d).padStart(2, '0');
    const mm2  = String(m + 1).padStart(2, '0');
    const hh   = String(date.getHours()).padStart(2, '0');
    const min  = String(date.getMinutes()).padStart(2, '0');
    const ss   = String(date.getSeconds()).padStart(2, '0');

    switch (format) {
      case 'short':         return `${d} ${MONTHS_SHORT[m]} ${yS}`;
      case 'mediumDate':    return `${d} ${MONTHS_SHORT[m]} ${y}`;
      case 'medium':        return `${d} ${MONTHS_FULL[m]} ${y}`;
      case 'long':          return `วัน${DAYS_FULL[dow]}ที่ ${d} ${MONTHS_FULL[m]} พ.ศ. ${y}`;
      case 'shortDate':     return `${dd2}/${mm2}/${y}`;
      case 'shortDateTime': return `${d} ${MONTHS_SHORT[m]} ${yS} ${hh}:${min}`;
      case 'mediumDateTime':return `${d} ${MONTHS_FULL[m]} ${y} ${hh}:${min}:${ss}`;
      case 'timeOnly':      return `${hh}:${min}:${ss}`;
      default:              return this.custom(format as string, d, m, y, yS, dd2, mm2, hh, min, ss, dow);
    }
  }

  private custom(pat: string, d: number, m: number, y: number, yS: string,
    dd2: string, mm2: string, hh: string, min: string, ss: string, dow: number): string {
    return pat
      .replace(/dddd/g, `วัน${DAYS_FULL[dow]}`)
      .replace(/MMMM/g, MONTHS_FULL[m])
      .replace(/MMM/g,  MONTHS_SHORT[m])
      .replace(/MM/g,   mm2)
      .replace(/M/g,    String(m + 1))
      .replace(/dd/g,   dd2)
      .replace(/d/g,    String(d))
      .replace(/yyyy/g, String(y))
      .replace(/yy/g,   yS)
      .replace(/HH/g,   hh)
      .replace(/mm/g,   min)
      .replace(/ss/g,   ss);
  }
}
