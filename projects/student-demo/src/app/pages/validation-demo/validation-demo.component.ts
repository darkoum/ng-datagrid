import { Component, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormComponent, FormItem, ValidationResult,
  ButtonComponent,
} from '@darkoum/ng-datagrid';

@Component({
  selector: 'app-validation-demo',
  standalone: true,
  imports: [CommonModule, FormComponent, ButtonComponent],
  template: `
<div class="page-wrap">

  <!-- ══ Header ══════════════════════════════════════════════════════════ -->
  <div class="page-header">
    <div>
      <h2 class="page-title">🛡 Validation Demo</h2>
      <p class="page-sub">ทดสอบระบบ validate ข้อมูลใน <code>app-form</code></p>
    </div>
  </div>

  <!-- ══ Form ════════════════════════════════════════════════════════════ -->
  <div class="card">
    <div class="card-header">📋 ฟอร์มข้อมูลนักศึกษา (กรุณากรอกข้อมูลให้ครบ)</div>
    <div class="card-body">
      <app-form
        #myForm
        [(formData)]="formData"
        [items]="formItems"
        [colCount]="2"
        [showRequiredMark]="true"
        labelMode="top">
      </app-form>

      <div class="action-row">
        <app-button text="✅ บันทึก" type="success" (onClick)="save()"></app-button>
        <app-button text="🔄 รีเซ็ต"  type="normal" (onClick)="reset()"></app-button>
        <app-button text="✖ ล้าง Error" type="danger" (onClick)="clearErrors()"></app-button>
      </div>

      <!-- Result badge -->
      @if (result()) {
        <div class="result-box" [class.result-ok]="result()!.isValid" [class.result-err]="!result()!.isValid">
          @if (result()!.isValid) {
            ✅ ผ่านการตรวจสอบทั้งหมด — พร้อมบันทึก
          } @else {
            ❌ พบข้อผิดพลาด {{ result()!.brokenRules.length }} รายการ
            <ul>
              @for (r of result()!.brokenRules; track r.dataField) {
                <li><strong>{{ r.dataField }}</strong>: {{ r.message }}</li>
              }
            </ul>
          }
        </div>
      }
    </div>
  </div>

  <!-- ══ Rule reference ════════════════════════════════════════════════ -->
  <div class="card">
    <div class="card-header">📖 Validation Rules ที่รองรับ</div>
    <div class="card-body">
      <table class="ref-table">
        <thead>
          <tr><th>type</th><th>ตัวเลือก</th><th>ตัวอย่าง</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><code>required</code></td>
            <td>message?</td>
            <td><code>{{ '{' }} type: 'required' {{ '}' }}</code></td>
          </tr>
          <tr>
            <td><code>stringLength</code></td>
            <td>min?, max?, message?</td>
            <td><code>{{ '{' }} type: 'stringLength', min: 5, max: 20 {{ '}' }}</code></td>
          </tr>
          <tr>
            <td><code>range</code></td>
            <td>min?, max?, message?</td>
            <td><code>{{ '{' }} type: 'range', min: 1, max: 4 {{ '}' }}</code></td>
          </tr>
          <tr>
            <td><code>pattern</code></td>
            <td>pattern (RegExp|string), message?</td>
            <td><code>{{ '{' }} type: 'pattern', pattern: /^[0-9]{{ '{' }}8{{ '}' }}$/ {{ '}' }}</code></td>
          </tr>
          <tr>
            <td><code>custom</code></td>
            <td>validationCallback: (v) => boolean, message?</td>
            <td><code>{{ '{' }} type: 'custom', validationCallback: v => v > 0 {{ '}' }}</code></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- ══ Code example ══════════════════════════════════════════════════ -->
  <div class="card">
    <div class="card-header">💻 ตัวอย่าง Code</div>
    <div class="card-body code-block">
      <pre [textContent]="codeExample"></pre>
    </div>
  </div>

</div>
  `,
  styles: [`
    .page-wrap { max-width: 860px; margin: 0 auto; display: flex; flex-direction: column; gap: 20px; }
    .page-header { display: flex; align-items: flex-start; justify-content: space-between; }
    .page-title  { margin: 0 0 4px; font-size: 20px; font-weight: 700; color: #2c3e50; }
    .page-sub    { margin: 0; font-size: 13px; color: #666; }
    .page-sub code { background: #f0f4f8; padding: 1px 5px; border-radius: 3px; }

    .card { background: #fff; border: 1px solid #dee2e6; border-radius: 8px; overflow: hidden; }
    .card-header { padding: 10px 16px; background: #f8f9fa; font-weight: 600; font-size: 14px;
                   border-bottom: 1px solid #dee2e6; }
    .card-body   { padding: 20px; }

    .action-row { display: flex; gap: 10px; margin-top: 20px; flex-wrap: wrap; }

    .result-box {
      margin-top: 16px; padding: 12px 16px; border-radius: 6px;
      font-size: 13px; line-height: 1.6;
    }
    .result-ok  { background: #d1fae5; color: #065f46; border: 1px solid #6ee7b7; }
    .result-err { background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; }
    .result-err ul { margin: 6px 0 0 18px; padding: 0; }
    .result-err li { margin: 2px 0; }

    .ref-table { width: 100%; border-collapse: collapse; font-size: 13px; }
    .ref-table th { background: #f1f5f9; padding: 8px 12px; text-align: left;
                    border: 1px solid #dee2e6; font-weight: 600; }
    .ref-table td { padding: 7px 12px; border: 1px solid #dee2e6; vertical-align: top; }
    .ref-table code { background: #f8f9fa; padding: 1px 5px; border-radius: 3px; font-size: 12px; }

    .code-block pre { margin: 0; font-size: 12px; line-height: 1.6; color: #1e293b;
                      background: #f8fafc; padding: 16px; border-radius: 4px; overflow-x: auto;
                      white-space: pre; font-family: 'Courier New', monospace; }
  `],
})
export class ValidationDemoComponent {
  @ViewChild('myForm') formRef!: FormComponent;

  formData: Record<string, any> = {};
  result = signal<ValidationResult | null>(null);

  // ── Form items พร้อม validation rules ──────────────────────────────────
  formItems: FormItem[] = [
    {
      itemType: 'group',
      caption: '📋 ข้อมูลหลัก',
      colCount: 2,
      items: [
        {
          dataField: 'studentcode',
          label: { text: 'รหัสนักศึกษา' },
          isRequired: true,
          validationRules: [
            { type: 'stringLength', min: 8, max: 10,
              message: 'รหัสนักศึกษาต้องมี 8-10 ตัวอักษร' },
            { type: 'pattern', pattern: /^[0-9]+$/,
              message: 'รหัสนักศึกษาต้องเป็นตัวเลขเท่านั้น' },
          ],
        },
        {
          dataField: 'prefixid',
          label: { text: 'คำนำหน้า' },
          isRequired: true,
          editorType: 'dxSelectBox',
          editorOptions: {
            dataSource: [
              { comboid: 1, comboshow: 'นาย' },
              { comboid: 2, comboshow: 'นาง' },
              { comboid: 3, comboshow: 'นางสาว' },
            ],
            valueExpr: 'comboid',
            displayExpr: 'comboshow',
          },
        },
        {
          dataField: 'studentname',
          label: { text: 'ชื่อ' },
          isRequired: true,
          validationRules: [
            { type: 'stringLength', min: 2,
              message: 'ชื่อต้องมีอย่างน้อย 2 ตัวอักษร' },
          ],
        },
        {
          dataField: 'studentsurname',
          label: { text: 'นามสกุล' },
          isRequired: true,
        },
      ],
    },
    {
      itemType: 'group',
      caption: '🎓 ข้อมูลการศึกษา',
      colCount: 2,
      items: [
        {
          dataField: 'gpa',
          label: { text: 'GPA' },
          editorType: 'dxNumberBox',
          editorOptions: { min: 0, max: 4, step: 0.01, showSpinButtons: false,
                           placeholder: '0.00 – 4.00' },
          validationRules: [
            { type: 'range', min: 0, max: 4,
              message: 'GPA ต้องอยู่ระหว่าง 0.00 – 4.00' },
          ],
        },
        {
          dataField: 'email',
          label: { text: 'อีเมล' },
          validationRules: [
            { type: 'pattern',
              pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'รูปแบบอีเมลไม่ถูกต้อง' },
          ],
        },
        {
          dataField: 'phone',
          label: { text: 'เบอร์โทร' },
          validationRules: [
            { type: 'pattern', pattern: /^[0-9]{10}$/,
              message: 'เบอร์โทรต้องเป็นตัวเลข 10 หลัก' },
          ],
        },
        {
          dataField: 'note',
          label: { text: 'หมายเหตุ' },
          editorType: 'dxTextArea',
          colSpan: 2,
          editorOptions: { rows: 3, placeholder: 'ข้อมูลเพิ่มเติม (ไม่บังคับ)' },
          validationRules: [
            { type: 'stringLength', max: 200,
              message: 'หมายเหตุต้องไม่เกิน 200 ตัวอักษร' },
          ],
        },
      ],
    },
  ];

  save(): void {
    const result = this.formRef.validate();
    this.result.set(result);
    if (result.isValid) {
      console.log('✅ บันทึก:', this.formData);
    }
  }

  reset(): void {
    this.formData = {};
    this.result.set(null);
    this.formRef.clearErrors();
  }

  clearErrors(): void {
    this.formRef.clearErrors();
    this.result.set(null);
  }

  readonly codeExample = `// 1. ใน FormItem เพิ่ม validationRules
formItems: FormItem[] = [
  {
    dataField: 'studentcode',
    label: { text: 'รหัสนักศึกษา' },
    isRequired: true,                      // แสดง * และ required check อัตโนมัติ
    validationRules: [
      { type: 'stringLength', min: 8, max: 10,
        message: 'ต้องมี 8-10 ตัวอักษร' },
      { type: 'pattern', pattern: /^[0-9]+$/,
        message: 'ต้องเป็นตัวเลขเท่านั้น' },
    ],
  },
  {
    dataField: 'gpa',
    validationRules: [
      { type: 'range', min: 0, max: 4 },
    ],
  },
  {
    dataField: 'email',
    validationRules: [
      { type: 'pattern', pattern: /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/,
        message: 'รูปแบบอีเมลไม่ถูกต้อง' },
    ],
  },
];

// 2. เรียก validate() ผ่าน ViewChild
@ViewChild('myForm') formRef!: FormComponent;

save() {
  const result = this.formRef.validate();
  // result.isValid        — true/false
  // result.brokenRules    — [{ dataField, message }]

  if (result.isValid) {
    // บันทึกข้อมูล
  }
}

// 3. ล้าง error
this.formRef.clearErrors();`;
}
