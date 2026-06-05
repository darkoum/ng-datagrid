import {
  Component, Input, Output, EventEmitter, signal, computed, TemplateRef,
  ContentChildren, QueryList, Directive, AfterContentInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormItem, ValidationRule, ValidationResult } from '../../models/datagrid.types';
import { ThaiDatepickerComponent } from '../thai-datepicker/thai-datepicker.component';
import { SelectBoxComponent } from '../select-box/select-box.component';
import { NumberBoxComponent } from '../number-box/number-box.component';
import { CheckBoxComponent } from '../check-box/check-box.component';
import { TagBoxComponent } from '../tag-box/tag-box.component';
import { RadioGroupComponent } from '../radio-group/radio-group.component';
import { TextAreaComponent } from '../text-area/text-area.component';
import { SwitchComponent } from '../switch/switch.component';

export interface FieldDataChangedEvent {
  dataField: string;
  value: any;
  previousValue: any;
}

/** Custom editor template — ตั้งชื่อให้ตรงกับ FormItem.editCellTemplate */
@Directive({ selector: '[formEditorTemplate]', standalone: true })
export class FormEditorTemplateDirective {
  @Input('formEditorTemplate') name!: string;
  constructor(public templateRef: TemplateRef<any>) {}
}

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    ThaiDatepickerComponent, SelectBoxComponent, NumberBoxComponent,
    CheckBoxComponent, TagBoxComponent, RadioGroupComponent,
    TextAreaComponent, SwitchComponent,
  ],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements AfterContentInit {

  // ─── Inputs ────────────────────────────────────────────────────────────────
  @Input() set formData(val: Record<string, any> | null | undefined) {
    this._data.set(val ? { ...val } : {});
  }
  @Output() formDataChange = new EventEmitter<Record<string, any>>();

  @Input() items: FormItem[] = [];
  /** จำนวนคอลัมน์ของ top-level items (default: 1) */
  @Input() colCount: 1 | 2 = 1;
  /** labelMode: 'top' | 'left' | 'hidden' */
  @Input() labelMode: 'top' | 'left' | 'hidden' = 'top';
  @Input() showColonAfterLabel = false;
  @Input() showRequiredMark = true;
  @Input() disabled = false;
  @Input() readOnly = false;
  /** ความกว้าง label ในโหมด 'left' (px) */
  @Input() labelWidth = 140;

  // ─── Outputs ───────────────────────────────────────────────────────────────
  @Output() onFieldDataChanged = new EventEmitter<FieldDataChangedEvent>();

  // ─── Content children ──────────────────────────────────────────────────────
  @ContentChildren(FormEditorTemplateDirective)
  editorTemplates!: QueryList<FormEditorTemplateDirective>;

  templateMap: Record<string, TemplateRef<any>> = {};

  ngAfterContentInit(): void {
    this.editorTemplates?.forEach(d => { this.templateMap[d.name] = d.templateRef; });
  }

  // ─── State ─────────────────────────────────────────────────────────────────
  private _data   = signal<Record<string, any>>({});
  private _errors = signal<Record<string, string>>({});

  readonly data = computed(() => this._data());

  // ─── Public API ────────────────────────────────────────────────────────────
  getValue(dataField?: string): any {
    if (!dataField) return undefined;
    return this._data()[dataField];
  }

  updateField(dataField: string | undefined, value: any): void {
    if (!dataField) return;
    const previousValue = this._data()[dataField];
    this._data.update(d => ({ ...d, [dataField]: value }));
    // ล้าง error ของ field นี้เมื่อผู้ใช้แก้ไข
    if (this._errors()[dataField]) {
      this._errors.update(e => { const next = { ...e }; delete next[dataField]; return next; });
    }
    this.formDataChange.emit(this._data());
    this.onFieldDataChanged.emit({ dataField, value, previousValue });
  }

  /** ตรวจสอบ validation ทั้ง form — คืน { isValid, brokenRules } */
  validate(): ValidationResult {
    const errors: Record<string, string> = {};
    const broken: { dataField: string; message: string }[] = [];

    const checkItem = (item: FormItem) => {
      if (item.itemType === 'group') { item.items?.forEach(checkItem); return; }
      if (!item.dataField || item.visible === false) return;

      const value  = this._data()[item.dataField];
      const rules  = [...(item.validationRules ?? [])];

      // isRequired → auto-prepend required rule ถ้ายังไม่มี
      if (item.isRequired && !rules.find(r => r.type === 'required')) {
        rules.unshift({ type: 'required' });
      }

      for (const rule of rules) {
        const msg = this._checkRule(rule, value, item);
        if (msg) {
          errors[item.dataField] = msg;
          broken.push({ dataField: item.dataField, message: msg });
          break; // แสดง error แรกที่เจอต่อ field
        }
      }
    };

    this.items.forEach(checkItem);
    this._errors.set(errors);
    return { isValid: broken.length === 0, brokenRules: broken };
  }

  /** ล้าง error ทั้งหมด */
  clearErrors(): void { this._errors.set({}); }

  /** ข้อความ error ของ field (ใช้ใน template) */
  getFieldError(dataField?: string): string {
    if (!dataField) return '';
    return this._errors()[dataField] ?? '';
  }

  // ─── Private ───────────────────────────────────────────────────────────────
  private _checkRule(rule: ValidationRule, value: any, item: FormItem): string | null {
    const label = this.getItemLabel(item);

    switch (rule.type) {
      case 'required': {
        const empty = value === null || value === undefined || value === ''
                   || (Array.isArray(value) && value.length === 0);
        return empty ? (rule.message ?? `${label} จำเป็นต้องระบุ`) : null;
      }
      case 'stringLength': {
        const len = String(value ?? '').length;
        if (rule.min !== undefined && len < rule.min)
          return rule.message ?? `${label} ต้องมีอย่างน้อย ${rule.min} ตัวอักษร`;
        if (rule.max !== undefined && len > rule.max)
          return rule.message ?? `${label} ต้องไม่เกิน ${rule.max} ตัวอักษร`;
        return null;
      }
      case 'range': {
        const num = Number(value);
        if (isNaN(num)) return rule.message ?? `${label} ต้องเป็นตัวเลข`;
        if (rule.min !== undefined && num < rule.min)
          return rule.message ?? `${label} ต้องไม่น้อยกว่า ${rule.min}`;
        if (rule.max !== undefined && num > rule.max)
          return rule.message ?? `${label} ต้องไม่มากกว่า ${rule.max}`;
        return null;
      }
      case 'pattern': {
        if (value === null || value === undefined || value === '') return null; // ให้ required handle
        const re = typeof rule.pattern === 'string' ? new RegExp(rule.pattern) : rule.pattern!;
        return re.test(String(value)) ? null : (rule.message ?? `${label} รูปแบบไม่ถูกต้อง`);
      }
      case 'custom': {
        if (!rule.validationCallback) return null;
        return rule.validationCallback(value) ? null : (rule.message ?? `${label} ไม่ถูกต้อง`);
      }
      default: return null;
    }
  }

  // ─── Item helpers ──────────────────────────────────────────────────────────
  getItemLabel(item: FormItem): string {
    if (item.label?.text) return item.label.text;
    return item.dataField ?? '';
  }

  getEditorType(item: FormItem): string {
    if (item.editorType) return item.editorType;
    return 'dxTextBox';
  }

  getDataSource(item: FormItem): any[] {
    return item.editorOptions?.['dataSource'] ?? [];
  }

  getValueExpr(item: FormItem): string {
    return item.editorOptions?.['valueExpr'] ?? 'value';
  }

  getDisplayExpr(item: FormItem): string {
    return item.editorOptions?.['displayExpr'] ?? 'label';
  }

  getPlaceholder(item: FormItem): string {
    return item.editorOptions?.['placeholder'] ?? '';
  }

  getMin(item: FormItem): number | undefined { return item.editorOptions?.['min']; }
  getMax(item: FormItem): number | undefined { return item.editorOptions?.['max']; }
  getStep(item: FormItem): number { return item.editorOptions?.['step'] ?? 1; }
  getRows(item: FormItem): number { return item.editorOptions?.['rows'] ?? 4; }
  getText(item: FormItem): string { return item.editorOptions?.['text'] ?? ''; }
  getSwitchedOnText(item: FormItem): string { return item.editorOptions?.['switchedOnText'] ?? ''; }
  getSwitchedOffText(item: FormItem): string { return item.editorOptions?.['switchedOffText'] ?? ''; }
  getLayout(item: FormItem): 'horizontal' | 'vertical' { return item.editorOptions?.['layout'] ?? 'vertical'; }
  getShowSpinButtons(item: FormItem): boolean { return item.editorOptions?.['showSpinButtons'] ?? false; }
  getShowClearButton(item: FormItem): boolean { return item.editorOptions?.['showClearButton'] ?? false; }
  getSearchEnabled(item: FormItem): boolean { return item.editorOptions?.['searchEnabled'] ?? false; }
  getFormat(item: FormItem): string { return item.editorOptions?.['format'] ?? 'shortDate'; }
}
