import { NgModule } from '@angular/core';
import {
  DatagridComponent,
  GridCellTemplateDirective,
  GridDetailTemplateDirective,
} from './components/datagrid/datagrid.component';
import { ThaiDatepickerComponent } from './components/thai-datepicker/thai-datepicker.component';
import { ThaiDatePipe }            from './pipes/thai-date.pipe';
import { ResizableColumnDirective } from './directives/resizable-column.directive';

// ── Widgets (DevExtreme replacements) ────────────────────────────────────────
import { SelectBoxComponent }      from './components/select-box/select-box.component';
import { NumberBoxComponent }      from './components/number-box/number-box.component';
import { TextBoxComponent }        from './components/text-box/text-box.component';
import { ButtonComponent }         from './components/button/button.component';
import { PopupComponent }          from './components/popup/popup.component';
import { LoadPanelComponent }      from './components/load-panel/load-panel.component';
import { TabPanelComponent }       from './components/tab-panel/tab-panel.component';
import { TabItemComponent }        from './components/tab-panel/tab-item.component';
import { AccordionComponent }      from './components/accordion/accordion.component';
import { AccordionItemComponent }  from './components/accordion/accordion-item.component';
import { CheckBoxComponent }       from './components/check-box/check-box.component';
import { DateBoxComponent }        from './components/date-box/date-box.component';
import { TagBoxComponent }         from './components/tag-box/tag-box.component';
import { RadioGroupComponent }     from './components/radio-group/radio-group.component';
import { TextAreaComponent }       from './components/text-area/text-area.component';
import { SwitchComponent }         from './components/switch/switch.component';

// ── Form ─────────────────────────────────────────────────────────────────────
import { FormComponent, FormEditorTemplateDirective } from './components/form/form.component';

const EXPORTS = [
  // DataGrid
  DatagridComponent,
  GridCellTemplateDirective,
  GridDetailTemplateDirective,
  // DatePicker
  ThaiDatepickerComponent,
  // Pipes & Directives
  ThaiDatePipe,
  ResizableColumnDirective,
  // Input Widgets
  SelectBoxComponent,
  NumberBoxComponent,
  TextBoxComponent,
  ButtonComponent,
  CheckBoxComponent,
  DateBoxComponent,
  TagBoxComponent,
  RadioGroupComponent,
  TextAreaComponent,
  SwitchComponent,
  // Layout Widgets
  PopupComponent,
  LoadPanelComponent,
  TabPanelComponent,
  TabItemComponent,
  AccordionComponent,
  AccordionItemComponent,
  // Form
  FormComponent,
  FormEditorTemplateDirective,
];

@NgModule({ imports: EXPORTS, exports: EXPORTS })
export class DatagridModule {}
