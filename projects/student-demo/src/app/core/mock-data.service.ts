import { Injectable } from '@angular/core';

export interface ComboItem { comboid: number | string; comboshow: string; }
export interface Student {
  studentid: number; studentcode: string; prefixid: number;
  studentname: string; studentsurname: string; studentstatus: number;
  studentyear: number; gpa: number; facultyid: number; programid: number;
  campusid: number; admitdate: string; finishdate: string | null;
}

@Injectable({ providedIn: 'root' })
export class MockDataService {

  prefixCombo: ComboItem[] = [
    { comboid: 1, comboshow: 'นาย' },
    { comboid: 2, comboshow: 'นาง' },
    { comboid: 3, comboshow: 'นางสาว' },
    { comboid: 4, comboshow: 'ดร.' },
  ];

  statusCombo: ComboItem[] = [
    { comboid: 1, comboshow: 'กำลังศึกษา' },
    { comboid: 2, comboshow: 'พักการศึกษา' },
    { comboid: 3, comboshow: 'พ้นสภาพ' },
    { comboid: 4, comboshow: 'จบการศึกษา' },
    { comboid: 5, comboshow: 'ลาออก' },
  ];

  facultyCombo: ComboItem[] = [
    { comboid: 1, comboshow: 'คณะวิศวกรรมศาสตร์' },
    { comboid: 2, comboshow: 'คณะวิทยาศาสตร์' },
    { comboid: 3, comboshow: 'คณะบริหารธุรกิจ' },
    { comboid: 4, comboshow: 'คณะนิติศาสตร์' },
    { comboid: 5, comboshow: 'คณะสถาปัตยกรรมศาสตร์' },
  ];

  programCombo: ComboItem[] = [
    { comboid: 1, comboshow: 'วิศวกรรมคอมพิวเตอร์' },
    { comboid: 2, comboshow: 'วิศวกรรมไฟฟ้า' },
    { comboid: 3, comboshow: 'วิศวกรรมโยธา' },
    { comboid: 4, comboshow: 'วิทยาการคอมพิวเตอร์' },
    { comboid: 5, comboshow: 'คณิตศาสตร์' },
    { comboid: 6, comboshow: 'การบัญชี' },
    { comboid: 7, comboshow: 'การตลาด' },
    { comboid: 8, comboshow: 'นิติศาสตร์' },
  ];

  campusCombo: ComboItem[] = [
    { comboid: 1, comboshow: 'วิทยาเขตหลัก' },
    { comboid: 2, comboshow: 'ศูนย์การศึกษาเชียงใหม่' },
    { comboid: 3, comboshow: 'ศูนย์การศึกษาภูเก็ต' },
  ];

  students: Student[] = [
    { studentid:1,  studentcode:'640001001', prefixid:1, studentname:'สมชาย',   studentsurname:'ใจดี',     studentstatus:1, studentyear:4, gpa:3.45, facultyid:1, programid:1, campusid:1, admitdate:'2021-06-01', finishdate:null },
    { studentid:2,  studentcode:'640001002', prefixid:3, studentname:'สุดา',     studentsurname:'รักเรียน', studentstatus:1, studentyear:4, gpa:3.82, facultyid:2, programid:4, campusid:1, admitdate:'2021-06-01', finishdate:null },
    { studentid:3,  studentcode:'640001003', prefixid:1, studentname:'วิชัย',    studentsurname:'มั่นใจ',   studentstatus:4, studentyear:4, gpa:2.98, facultyid:3, programid:6, campusid:1, admitdate:'2021-06-01', finishdate:'2025-03-15' },
    { studentid:4,  studentcode:'650001001', prefixid:2, studentname:'นงนุช',    studentsurname:'สวยงาม',   studentstatus:1, studentyear:3, gpa:3.61, facultyid:1, programid:2, campusid:2, admitdate:'2022-06-01', finishdate:null },
    { studentid:5,  studentcode:'650001002', prefixid:1, studentname:'ประเสริฐ', studentsurname:'ดีมาก',    studentstatus:2, studentyear:3, gpa:2.10, facultyid:4, programid:8, campusid:1, admitdate:'2022-06-01', finishdate:null },
    { studentid:6,  studentcode:'650001003', prefixid:3, studentname:'มาลี',     studentsurname:'งามเอี่ยม',studentstatus:1, studentyear:3, gpa:3.90, facultyid:2, programid:5, campusid:3, admitdate:'2022-06-01', finishdate:null },
    { studentid:7,  studentcode:'660001001', prefixid:1, studentname:'อนุชา',    studentsurname:'ขยันทำ',   studentstatus:1, studentyear:2, gpa:3.20, facultyid:1, programid:3, campusid:1, admitdate:'2023-06-01', finishdate:null },
    { studentid:8,  studentcode:'660001002', prefixid:3, studentname:'ปรียา',    studentsurname:'แสนดี',    studentstatus:1, studentyear:2, gpa:3.55, facultyid:3, programid:7, campusid:2, admitdate:'2023-06-01', finishdate:null },
    { studentid:9,  studentcode:'660001003', prefixid:1, studentname:'กิตติ',    studentsurname:'โชคดี',    studentstatus:3, studentyear:2, gpa:1.50, facultyid:1, programid:1, campusid:1, admitdate:'2023-06-01', finishdate:'2024-11-01' },
    { studentid:10, studentcode:'660001004', prefixid:2, studentname:'รัตนา',    studentsurname:'มีสุข',    studentstatus:1, studentyear:2, gpa:3.78, facultyid:2, programid:4, campusid:1, admitdate:'2023-06-01', finishdate:null },
    { studentid:11, studentcode:'670001001', prefixid:1, studentname:'ธนพล',     studentsurname:'เก่งมาก',  studentstatus:1, studentyear:1, gpa:3.95, facultyid:5, programid:1, campusid:1, admitdate:'2024-06-01', finishdate:null },
    { studentid:12, studentcode:'670001002', prefixid:3, studentname:'ชลธิชา',   studentsurname:'ใสสะอาด',  studentstatus:1, studentyear:1, gpa:3.40, facultyid:3, programid:6, campusid:3, admitdate:'2024-06-01', finishdate:null },
    { studentid:13, studentcode:'670001003', prefixid:1, studentname:'พงศกร',    studentsurname:'มีวินัย',   studentstatus:1, studentyear:1, gpa:3.15, facultyid:1, programid:2, campusid:2, admitdate:'2024-06-01', finishdate:null },
    { studentid:14, studentcode:'670001004', prefixid:3, studentname:'กัญญา',    studentsurname:'รักษ์ดี',  studentstatus:1, studentyear:1, gpa:3.67, facultyid:4, programid:8, campusid:1, admitdate:'2024-06-01', finishdate:null },
    { studentid:15, studentcode:'670001005', prefixid:1, studentname:'นราธิป',   studentsurname:'สุขสันต์',  studentstatus:5, studentyear:1, gpa:0.00, facultyid:2, programid:5, campusid:1, admitdate:'2024-06-01', finishdate:'2024-09-01' },
    { studentid:16, studentcode:'670001006', prefixid:2, studentname:'อรอุมา',   studentsurname:'แก้วใส',    studentstatus:1, studentyear:1, gpa:3.88, facultyid:1, programid:3, campusid:1, admitdate:'2024-06-01', finishdate:null },
    { studentid:17, studentcode:'630001001', prefixid:1, studentname:'สุรชัย',   studentsurname:'ดีเลิศ',   studentstatus:4, studentyear:4, gpa:3.22, facultyid:3, programid:7, campusid:2, admitdate:'2020-06-01', finishdate:'2024-03-15' },
    { studentid:18, studentcode:'630001002', prefixid:3, studentname:'พรพิมล',   studentsurname:'งามวิไล',  studentstatus:4, studentyear:4, gpa:3.76, facultyid:1, programid:1, campusid:1, admitdate:'2020-06-01', finishdate:'2024-03-15' },
    { studentid:19, studentcode:'650001004', prefixid:1, studentname:'ปฐมพล',    studentsurname:'มั่นคง',    studentstatus:2, studentyear:3, gpa:2.45, facultyid:5, programid:1, campusid:3, admitdate:'2022-06-01', finishdate:null },
    { studentid:20, studentcode:'660001005', prefixid:3, studentname:'นภัสสร',   studentsurname:'ใจงาม',    studentstatus:1, studentyear:2, gpa:3.50, facultyid:2, programid:4, campusid:1, admitdate:'2023-06-01', finishdate:null },
  ];

  getStudents(filter?: Partial<Student>): Student[] {
    if (!filter) return [...this.students];
    return this.students.filter(s => {
      if (filter.studentstatus && s.studentstatus !== filter.studentstatus) return false;
      if (filter.facultyid && s.facultyid !== filter.facultyid) return false;
      return true;
    });
  }

  // ─── Student Set (กลุ่มนักศึกษา) ──────────────────────────────────────
  levelCombo: ComboItem[] = [
    { comboid: 1, comboshow: 'ปริญญาตรี' },
    { comboid: 2, comboshow: 'ปริญญาโท' },
    { comboid: 3, comboshow: 'ปริญญาเอก' },
    { comboid: 4, comboshow: 'ประกาศนียบัตรบัณฑิต' },
  ];

  degreeCombo: ComboItem[] = [
    { comboid: 1, comboshow: 'วิทยาศาสตรบัณฑิต (วท.บ.)' },
    { comboid: 2, comboshow: 'วิศวกรรมศาสตรบัณฑิต (วศ.บ.)' },
    { comboid: 3, comboshow: 'บริหารธุรกิจบัณฑิต (บธ.บ.)' },
    { comboid: 4, comboshow: 'นิติศาสตรบัณฑิต (น.บ.)' },
    { comboid: 5, comboshow: 'วิทยาศาสตรมหาบัณฑิต (วท.ม.)' },
  ];

  studyPeriodCombo: ComboItem[] = [
    { comboid: 1, comboshow: '1: ปกติ' },
    { comboid: 2, comboshow: '2: ภาคค่ำ' },
    { comboid: 3, comboshow: '3: เสาร์-อาทิตย์' },
    { comboid: 4, comboshow: '4: ออนไลน์' },
  ];

  setStatusCombo: ComboItem[] = [
    { comboid: 10, comboshow: '10: จัดเตรียม' },
    { comboid: 20, comboshow: '20: เปิดรับ' },
    { comboid: 30, comboshow: '30: ปิดรับ' },
    { comboid: 40, comboshow: '40: เปิดเรียน' },
    { comboid: 50, comboshow: '50: ปิดกลุ่ม' },
  ];

  acadCombo: ComboItem[] = [
    { comboid: 1, comboshow: 'ระบบ A/B/C/D/F' },
    { comboid: 2, comboshow: 'ระบบ S/U' },
    { comboid: 3, comboshow: 'ระบบ P/F' },
  ];

  scheduleCombo: ComboItem[] = [
    { comboid: 1, comboshow: 'ปฏิทิน 2567/1' },
    { comboid: 2, comboshow: 'ปฏิทิน 2567/2' },
    { comboid: 3, comboshow: 'ปฏิทิน 2568/1' },
    { comboid: 4, comboshow: 'ปฏิทิน 2568/2' },
  ];

  feeGroupCombo: ComboItem[] = [
    { comboid: 1, comboshow: 'บัญชีทั่วไป' },
    { comboid: 2, comboshow: 'บัญชีวิศวกรรม' },
    { comboid: 3, comboshow: 'บัญชีนานาชาติ' },
  ];

  officerCombo: ComboItem[] = [
    { comboid: 1, comboshow: 'ผศ.ดร.สมชาย วิชาการ' },
    { comboid: 2, comboshow: 'รศ.ดร.สุนีย์ ใจดี' },
    { comboid: 3, comboshow: 'อ.ดร.ประเสริฐ รักเรียน' },
    { comboid: 4, comboshow: 'ผศ.นงนุช มั่นใจ' },
    { comboid: 5, comboshow: 'ศ.ดร.วิชัย ดีเลิศ' },
  ];

  studentSetList: any[] = [
    { setid:1,  groupyear:67, campusid:1, programid:1, programshow:'วิศวกรรมคอมพิวเตอร์',       graduateprogramid:1, startstudentcode:'670001001', studyperiod:1, groupcode:'A', studentgroupabb:'COMP-67A', plantotalseat:40, totalnum:38, studentnum:36, currentnum:34, graduatnum:0, retirenum:2, groupseq:1, feegroupid:2, acadid:1, schedulegroupid:3, admitdate:new Date('2024-06-01'), admitacadyear:2567, admitsemester:1, officerid:1, officerid2:2, officerid3:null, officerid4:null, officerid5:null, studentsetstatus:40 },
    { setid:2,  groupyear:67, campusid:1, programid:1, programshow:'วิศวกรรมคอมพิวเตอร์',       graduateprogramid:1, startstudentcode:'670002001', studyperiod:1, groupcode:'B', studentgroupabb:'COMP-67B', plantotalseat:40, totalnum:35, studentnum:33, currentnum:32, graduatnum:0, retirenum:1, groupseq:2, feegroupid:2, acadid:1, schedulegroupid:3, admitdate:new Date('2024-06-01'), admitacadyear:2567, admitsemester:1, officerid:3, officerid2:4, officerid3:null, officerid4:null, officerid5:null, studentsetstatus:40 },
    { setid:3,  groupyear:67, campusid:1, programid:2, programshow:'วิศวกรรมไฟฟ้า',             graduateprogramid:2, startstudentcode:'670003001', studyperiod:1, groupcode:'A', studentgroupabb:'EE-67A',   plantotalseat:35, totalnum:30, studentnum:29, currentnum:29, graduatnum:0, retirenum:0, groupseq:1, feegroupid:2, acadid:1, schedulegroupid:3, admitdate:new Date('2024-06-01'), admitacadyear:2567, admitsemester:1, officerid:5, officerid2:1, officerid3:null, officerid4:null, officerid5:null, studentsetstatus:40 },
    { setid:4,  groupyear:67, campusid:2, programid:4, programshow:'วิทยาการคอมพิวเตอร์',        graduateprogramid:4, startstudentcode:'670101001', studyperiod:3, groupcode:'A', studentgroupabb:'CS-67-CM', plantotalseat:30, totalnum:25, studentnum:24, currentnum:24, graduatnum:0, retirenum:0, groupseq:1, feegroupid:1, acadid:1, schedulegroupid:3, admitdate:new Date('2024-06-01'), admitacadyear:2567, admitsemester:1, officerid:2, officerid2:3, officerid3:null, officerid4:null, officerid5:null, studentsetstatus:40 },
    { setid:5,  groupyear:66, campusid:1, programid:1, programshow:'วิศวกรรมคอมพิวเตอร์',       graduateprogramid:1, startstudentcode:'660001001', studyperiod:1, groupcode:'A', studentgroupabb:'COMP-66A', plantotalseat:40, totalnum:40, studentnum:38, currentnum:36, graduatnum:0, retirenum:2, groupseq:1, feegroupid:2, acadid:1, schedulegroupid:1, admitdate:new Date('2023-06-01'), admitacadyear:2566, admitsemester:1, officerid:1, officerid2:2, officerid3:null, officerid4:null, officerid5:null, studentsetstatus:40 },
    { setid:6,  groupyear:66, campusid:1, programid:6, programshow:'การบัญชี',                   graduateprogramid:6, startstudentcode:'660004001', studyperiod:2, groupcode:'A', studentgroupabb:'ACC-66A',  plantotalseat:45, totalnum:43, studentnum:40, currentnum:38, graduatnum:0, retirenum:2, groupseq:1, feegroupid:1, acadid:1, schedulegroupid:1, admitdate:new Date('2023-06-01'), admitacadyear:2566, admitsemester:1, officerid:4, officerid2:5, officerid3:null, officerid4:null, officerid5:null, studentsetstatus:40 },
    { setid:7,  groupyear:65, campusid:1, programid:3, programshow:'วิศวกรรมโยธา',              graduateprogramid:3, startstudentcode:'650005001', studyperiod:1, groupcode:'A', studentgroupabb:'CE-65A',   plantotalseat:35, totalnum:35, studentnum:32, currentnum:28, graduatnum:4, retirenum:3, groupseq:1, feegroupid:2, acadid:1, schedulegroupid:2, admitdate:new Date('2022-06-01'), admitacadyear:2565, admitsemester:1, officerid:3, officerid2:1, officerid3:null, officerid4:null, officerid5:null, studentsetstatus:40 },
    { setid:8,  groupyear:64, campusid:1, programid:1, programshow:'วิศวกรรมคอมพิวเตอร์',       graduateprogramid:1, startstudentcode:'640001001', studyperiod:1, groupcode:'A', studentgroupabb:'COMP-64A', plantotalseat:40, totalnum:38, studentnum:35, currentnum:3,  graduatnum:30, retirenum:5, groupseq:1, feegroupid:2, acadid:1, schedulegroupid:2, admitdate:new Date('2021-06-01'), admitacadyear:2564, admitsemester:1, officerid:1, officerid2:2, officerid3:3, officerid4:null, officerid5:null, studentsetstatus:50 },
    { setid:9,  groupyear:68, campusid:1, programid:7, programshow:'การตลาด',                    graduateprogramid:7, startstudentcode:'680001001', studyperiod:3, groupcode:'A', studentgroupabb:'MKT-68A',  plantotalseat:40, totalnum:20, studentnum:0,  currentnum:0,  graduatnum:0, retirenum:0, groupseq:1, feegroupid:1, acadid:1, schedulegroupid:4, admitdate:new Date('2025-06-01'), admitacadyear:2568, admitsemester:1, officerid:4, officerid2:5, officerid3:null, officerid4:null, officerid5:null, studentsetstatus:20 },
    { setid:10, groupyear:68, campusid:3, programid:8, programshow:'นิติศาสตร์',                 graduateprogramid:8, startstudentcode:'680201001', studyperiod:3, groupcode:'A', studentgroupabb:'LAW-68-PK', plantotalseat:30, totalnum:0,  studentnum:0,  currentnum:0,  graduatnum:0, retirenum:0, groupseq:1, feegroupid:1, acadid:2, schedulegroupid:4, admitdate:new Date('2025-06-01'), admitacadyear:2568, admitsemester:1, officerid:2, officerid2:null, officerid3:null, officerid4:null, officerid5:null, studentsetstatus:10 },
  ];

  // ─── prgstudentstatus ─────────────────────────────────────────────────────
  enrollTypeCombo: ComboItem[]  = [{ comboid:1, comboshow:'ปกติ' },{ comboid:2, comboshow:'เงื่อนไข' },{ comboid:3, comboshow:'ผ่อนผัน' }];
  enrollStatusCombo: ComboItem[]= [{ comboid:1, comboshow:'ปกติ' },{ comboid:2, comboshow:'Lock ลงทะเบียน' },{ comboid:3, comboshow:'Lock ระบบ' }];
  gradeStatusCombo: ComboItem[] = [{ comboid:1, comboshow:'ปกติ' },{ comboid:2, comboshow:'รอส่งเกรด' },{ comboid:3, comboshow:'ล็อคเกรด' }];
  gradeProCombo: ComboItem[]    = [{ comboid:1, comboshow:'ปกติ' },{ comboid:2, comboshow:'ทดลองเรียน' },{ comboid:3, comboshow:'Prob' }];

  // สถานะรายภาค (studentid → list)
  studentStatusHistory: Record<number, any[]> = {
    1: [
      { id:1, acadyear:2564, semester:1, studentstatus:1, studentstatusshow:'กำลังศึกษา', remark:'', gpa:3.20, gpax:3.20, creditattempt:18, creditsatisfy:18, creditpoint:18, gradepoint:57.6, sumcreditsatisfy:18, enrolltype:1, enrollstatus:1, gradestatus:1, gradepro:1 },
      { id:2, acadyear:2564, semester:2, studentstatus:1, studentstatusshow:'กำลังศึกษา', remark:'', gpa:3.45, gpax:3.32, creditattempt:18, creditsatisfy:18, creditpoint:18, gradepoint:62.1, sumcreditsatisfy:36, enrolltype:1, enrollstatus:1, gradestatus:1, gradepro:1 },
      { id:3, acadyear:2565, semester:1, studentstatus:1, studentstatusshow:'กำลังศึกษา', remark:'', gpa:3.60, gpax:3.42, creditattempt:18, creditsatisfy:18, creditpoint:18, gradepoint:64.8, sumcreditsatisfy:54, enrolltype:1, enrollstatus:1, gradestatus:1, gradepro:1 },
      { id:4, acadyear:2565, semester:2, studentstatus:1, studentstatusshow:'กำลังศึกษา', remark:'', gpa:3.50, gpax:3.44, creditattempt:18, creditsatisfy:18, creditpoint:18, gradepoint:63.0, sumcreditsatisfy:72, enrolltype:1, enrollstatus:1, gradestatus:1, gradepro:1 },
      { id:5, acadyear:2566, semester:1, studentstatus:1, studentstatusshow:'กำลังศึกษา', remark:'', gpa:3.40, gpax:3.43, creditattempt:18, creditsatisfy:18, creditpoint:18, gradepoint:61.2, sumcreditsatisfy:90, enrolltype:1, enrollstatus:1, gradestatus:1, gradepro:1 },
      { id:6, acadyear:2566, semester:2, studentstatus:1, studentstatusshow:'กำลังศึกษา', remark:'', gpa:3.55, gpax:3.45, creditattempt:15, creditsatisfy:15, creditpoint:15, gradepoint:53.25,sumcreditsatisfy:105,enrolltype:1, enrollstatus:1, gradestatus:1, gradepro:1 },
    ],
    2: [
      { id:1, acadyear:2564, semester:1, studentstatus:1, studentstatusshow:'กำลังศึกษา', remark:'', gpa:3.80, gpax:3.80, creditattempt:18, creditsatisfy:18, creditpoint:18, gradepoint:68.4, sumcreditsatisfy:18, enrolltype:1, enrollstatus:1, gradestatus:1, gradepro:1 },
      { id:2, acadyear:2564, semester:2, studentstatus:1, studentstatusshow:'กำลังศึกษา', remark:'', gpa:3.85, gpax:3.82, creditattempt:18, creditsatisfy:18, creditpoint:18, gradepoint:69.3, sumcreditsatisfy:36, enrolltype:1, enrollstatus:1, gradestatus:1, gradepro:1 },
      { id:3, acadyear:2565, semester:1, studentstatus:1, studentstatusshow:'กำลังศึกษา', remark:'', gpa:3.78, gpax:3.81, creditattempt:18, creditsatisfy:18, creditpoint:18, gradepoint:68.0, sumcreditsatisfy:54, enrolltype:1, enrollstatus:1, gradestatus:1, gradepro:1 },
      { id:4, acadyear:2565, semester:2, studentstatus:1, studentstatusshow:'กำลังศึกษา', remark:'', gpa:3.90, gpax:3.83, creditattempt:18, creditsatisfy:18, creditpoint:18, gradepoint:70.2, sumcreditsatisfy:72, enrolltype:1, enrollstatus:1, gradestatus:1, gradepro:1 },
    ],
    5: [
      { id:1, acadyear:2565, semester:1, studentstatus:1, studentstatusshow:'กำลังศึกษา', remark:'', gpa:2.10, gpax:2.10, creditattempt:18, creditsatisfy:15, creditpoint:15, gradepoint:31.5, sumcreditsatisfy:15, enrolltype:1, enrollstatus:1, gradestatus:1, gradepro:3 },
      { id:2, acadyear:2565, semester:2, studentstatus:2, studentstatusshow:'พักการศึกษา', remark:'ปัญหาสุขภาพ', gpa:0, gpax:2.10, creditattempt:0, creditsatisfy:0, creditpoint:0, gradepoint:0, sumcreditsatisfy:15, enrolltype:1, enrollstatus:2, gradestatus:1, gradepro:1 },
    ],
  };

  // ผลลงทะเบียนรายภาค (studentid_acadyear_semester → courses)
  enrollResults: Record<string, any[]> = {
    '1_2566_2': [
      { coursecode:'01076313', coursename:'วิศวกรรมซอฟต์แวร์',       sectioncode:'1', grade:'A',  creditattempt:3 },
      { coursecode:'01076314', coursename:'ฐานข้อมูล',               sectioncode:'1', grade:'B+', creditattempt:3 },
      { coursecode:'01076315', coursename:'เครือข่ายคอมพิวเตอร์',    sectioncode:'2', grade:'A',  creditattempt:3 },
      { coursecode:'01076316', coursename:'ปัญญาประดิษฐ์',           sectioncode:'1', grade:'B',  creditattempt:3 },
      { coursecode:'01076399', coursename:'โครงงานวิศวกรรม',          sectioncode:'1', grade:'A',  creditattempt:3 },
    ],
    '1_2566_1': [
      { coursecode:'01076301', coursename:'สถาปัตยกรรมคอมพิวเตอร์',  sectioncode:'1', grade:'A',  creditattempt:3 },
      { coursecode:'01076302', coursename:'ระบบปฏิบัติการ',           sectioncode:'1', grade:'B+', creditattempt:3 },
      { coursecode:'01076303', coursename:'อัลกอริทึม',               sectioncode:'1', grade:'A',  creditattempt:3 },
      { coursecode:'01076304', coursename:'คณิตศาสตร์วิศวกรรม',      sectioncode:'2', grade:'B',  creditattempt:3 },
      { coursecode:'01076305', coursename:'ภาษาโปรแกรม',              sectioncode:'1', grade:'B+', creditattempt:3 },
      { coursecode:'01076306', coursename:'สัมมนา',                   sectioncode:'1', grade:'S',  creditattempt:1 },
    ],
  };

  // ตารางเรียน (studentid_acadyear_semester → schedule)
  classSchedule: Record<string, any[]> = {
    '1_2566_2': [
      { weekday:'จ', timeshowfrom:'08:00', timeshowto:'11:00', coursecode:'01076313', roomcode:'ENG-301' },
      { weekday:'อ', timeshowfrom:'09:00', timeshowto:'12:00', coursecode:'01076314', roomcode:'SCI-201' },
      { weekday:'พ', timeshowfrom:'13:00', timeshowto:'16:00', coursecode:'01076315', roomcode:'ENG-201' },
      { weekday:'พฤ',timeshowfrom:'08:00', timeshowto:'11:00', coursecode:'01076316', roomcode:'ENG-401' },
      { weekday:'ศ', timeshowfrom:'09:00', timeshowto:'16:00', coursecode:'01076399', roomcode:'LAB-101' },
    ],
  };

  // ตารางสอบ (studentid_acadyear_semester → exams)
  examSchedule: Record<string, any[]> = {
    '1_2566_2': [
      { examcode:'MID', examdate:'2566-10-20', examtimefrom:'09:00', examtimeto:'12:00', coursecode:'01076313', roomcode:'ENG-301' },
      { examcode:'MID', examdate:'2566-10-21', examtimefrom:'09:00', examtimeto:'12:00', coursecode:'01076314', roomcode:'SCI-201' },
      { examcode:'FIN', examdate:'2566-12-15', examtimefrom:'09:00', examtimeto:'12:00', coursecode:'01076313', roomcode:'ENG-301' },
      { examcode:'FIN', examdate:'2566-12-16', examtimefrom:'13:00', examtimeto:'16:00', coursecode:'01076314', roomcode:'SCI-201' },
      { examcode:'FIN', examdate:'2566-12-17', examtimefrom:'09:00', examtimeto:'12:00', coursecode:'01076315', roomcode:'ENG-201' },
    ],
  };

  // ─── prgstudentbioentry — รายการข้อมูลชีวประวัติ ─────────────────────────
  bioFieldTemplate: any[] = [
    { entryid:1,  entryname:'เลขบัตรประชาชน/หนังสือเดินทาง', invalue:'', columntype:'T' },
    { entryid:2,  entryname:'วัน/เดือน/ปีเกิด',              invalue:'', columntype:'D' },
    { entryid:3,  entryname:'จังหวัดเกิด (ภูมิลำเนา)',       invalue:'', columntype:'T' },
    { entryid:4,  entryname:'สัญชาติ',                        invalue:'', columntype:'T' },
    { entryid:5,  entryname:'ศาสนา',                          invalue:'', columntype:'T' },
    { entryid:6,  entryname:'หมู่โลหิต',                      invalue:'', columntype:'T' },
    { entryid:7,  entryname:'โทรศัพท์มือถือ',                 invalue:'', columntype:'T' },
    { entryid:8,  entryname:'อีเมล',                          invalue:'', columntype:'T' },
    { entryid:9,  entryname:'ที่อยู่ตามทะเบียนบ้าน',          invalue:'', columntype:'T' },
    { entryid:10, entryname:'จังหวัด (ทะเบียนบ้าน)',          invalue:'', columntype:'T' },
    { entryid:11, entryname:'รหัสไปรษณีย์ (ทะเบียนบ้าน)',    invalue:'', columntype:'T' },
    { entryid:12, entryname:'ที่อยู่ปัจจุบัน',                invalue:'', columntype:'T' },
    { entryid:13, entryname:'จังหวัด (ปัจจุบัน)',              invalue:'', columntype:'T' },
    { entryid:14, entryname:'รหัสไปรษณีย์ (ปัจจุบัน)',        invalue:'', columntype:'T' },
    { entryid:15, entryname:'ชื่อ-นามสกุล บิดา',              invalue:'', columntype:'T' },
    { entryid:16, entryname:'ชื่อ-นามสกุล มารดา',             invalue:'', columntype:'T' },
    { entryid:17, entryname:'ชื่อ-นามสกุล ผู้ปกครอง',         invalue:'', columntype:'T' },
    { entryid:18, entryname:'โทรศัพท์ผู้ปกครอง',              invalue:'', columntype:'T' },
    { entryid:19, entryname:'ชื่อสถานศึกษาเดิม',              invalue:'', columntype:'T' },
    { entryid:20, entryname:'วุฒิการศึกษาเดิม',               invalue:'', columntype:'T' },
  ];

  getBioFields(studentid: number): any[] {
    // mock — ใช้ template เดิมสำหรับทุก student
    return this.bioFieldTemplate.map(f => ({ ...f }));
  }

  // รายชื่อนักศึกษาจำลองต่อกลุ่ม (setid → students)
  studentsBySet: Record<number, any[]> = {
    8: [ // COMP-64A — มีนักศึกษาจำนวนมาก (ดึงจาก students เดิม)
      { studentcode:'640001001', prefixname:'นาย',    studentname:'สมชาย ใจดี',       studentstatusshow:'กำลังศึกษา' },
      { studentcode:'640001002', prefixname:'นางสาว', studentname:'สุดา รักเรียน',     studentstatusshow:'กำลังศึกษา' },
      { studentcode:'640001003', prefixname:'นาย',    studentname:'วิชัย มั่นใจ',      studentstatusshow:'จบการศึกษา' },
    ],
    5: [ // COMP-66A
      { studentcode:'660001001', prefixname:'นาย',    studentname:'อนุชา ขยันทำ',     studentstatusshow:'กำลังศึกษา' },
      { studentcode:'660001003', prefixname:'นาย',    studentname:'กิตติ โชคดี',       studentstatusshow:'พ้นสภาพ' },
      { studentcode:'660001004', prefixname:'นาง',    studentname:'รัตนา มีสุข',       studentstatusshow:'กำลังศึกษา' },
    ],
    1: [ // COMP-67A
      { studentcode:'670001001', prefixname:'นาย',    studentname:'ธนพล เก่งมาก',     studentstatusshow:'กำลังศึกษา' },
      { studentcode:'670001003', prefixname:'นาย',    studentname:'พงศกร มีวินัย',     studentstatusshow:'กำลังศึกษา' },
    ],
  };
}
