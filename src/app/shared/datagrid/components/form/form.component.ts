import {
  Component, Input, Output, EventEmitter, signal, computed, TemplateRef,
  ContentChildren, QueryList, Directive, AfterContentInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormItem } from '../../models/datagrid.types';
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
  private _data = signal<Record<string, any>>({});
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
    this.formDataChange.emit(this._data());
    this.onFieldDataChanged.emit({ dataField, value, previousValue });
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
