import { ThaiDatePipe } from './thai-date.pipe';

describe('ThaiDatePipe', () => {
  let pipe: ThaiDatePipe;
  // วันศุกร์ 25 มกราคม ค.ศ. 2025 (= พ.ศ. 2568) เวลา 10:30:45
  const testDate = new Date(2025, 0, 25, 10, 30, 45);

  beforeEach(() => { pipe = new ThaiDatePipe(); });

  it('should return "-" for null', () => {
    expect(pipe.transform(null)).toBe('-');
  });

  it('short → "25 ม.ค. 68"', () => {
    expect(pipe.transform(testDate, 'short')).toBe('25 ม.ค. 68');
  });

  it('mediumDate → "25 ม.ค. 2568"', () => {
    expect(pipe.transform(testDate, 'mediumDate')).toBe('25 ม.ค. 2568');
  });

  it('medium → "25 มกราคม 2568"', () => {
    expect(pipe.transform(testDate, 'medium')).toBe('25 มกราคม 2568');
  });

  it('long → "วันเสาร์ที่ 25 มกราคม พ.ศ. 2568"', () => {
    expect(pipe.transform(testDate, 'long')).toBe('วันเสาร์ที่ 25 มกราคม พ.ศ. 2568');
  });

  it('shortDate → "25/01/2568"', () => {
    expect(pipe.transform(testDate, 'shortDate')).toBe('25/01/2568');
  });

  it('shortDateTime → "25 ม.ค. 68 10:30"', () => {
    expect(pipe.transform(testDate, 'shortDateTime')).toBe('25 ม.ค. 68 10:30');
  });

  it('mediumDateTime → "25 มกราคม 2568 10:30:45"', () => {
    expect(pipe.transform(testDate, 'mediumDateTime')).toBe('25 มกราคม 2568 10:30:45');
  });

  it('timeOnly → "10:30:45"', () => {
    expect(pipe.transform(testDate, 'timeOnly')).toBe('10:30:45');
  });

  it('custom pattern "dd/MM/yyyy" → "25/01/2568"', () => {
    expect(pipe.transform(testDate, 'dd/MM/yyyy')).toBe('25/01/2568');
  });

  it('custom pattern "d MMMM yyyy" → "25 มกราคม 2568"', () => {
    expect(pipe.transform(testDate, 'd MMMM yyyy')).toBe('25 มกราคม 2568');
  });

  it('should accept ISO string', () => {
    expect(pipe.transform('2025-01-25T00:00:00', 'shortDate')).toBe('25/01/2568');
  });

  it('should return "-" for empty string', () => {
    expect(pipe.transform('')).toBe('-');
  });
});
