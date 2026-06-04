import { Routes } from '@angular/router';
import { StudentMasterComponent } from './pages/student-master/student-master.component';
import { DateDemoComponent } from './pages/date-demo/date-demo.component';
import { StudentSetComponent } from './pages/student-set/student-set.component';
import { CountryMasterComponent } from './pages/country-master/country-master.component';
import { StudentRegistryComponent } from './pages/student-registry/student-registry.component';
import { StudentStatusComponent } from './pages/student-status/student-status.component';
import { StudentBioentryComponent } from './pages/student-bioentry/student-bioentry.component';
import { StudentAllinfoComponent } from './pages/student-allinfo/student-allinfo.component';
import { EnrollRegistrationComponent } from './pages/enroll-registration/enroll-registration.component';
import { GradeResultComponent } from './pages/grade-result/grade-result.component';

export const routes: Routes = [
  { path: '', redirectTo: 'student-master', pathMatch: 'full' },
  { path: 'student-master',  component: StudentMasterComponent },
  { path: 'date-demo',       component: DateDemoComponent },
  { path: 'student-set',     component: StudentSetComponent },
  { path: 'country-master',    component: CountryMasterComponent },
  { path: 'student-registry', component: StudentRegistryComponent },
  { path: 'student-status',   component: StudentStatusComponent },
  { path: 'student-bioentry', component: StudentBioentryComponent },
  { path: 'student-allinfo',  component: StudentAllinfoComponent },
  { path: 'enroll',           component: EnrollRegistrationComponent },
  { path: 'grade',            component: GradeResultComponent },
];
