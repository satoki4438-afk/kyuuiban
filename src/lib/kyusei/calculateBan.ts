import type { BanPositions, Direction } from './types';
import { BAN_LAYOUT } from './constants';

function normStar(n: number): number {
  let s = n;
  while (s < 1) s += 9;
  while (s > 9) s -= 9;
  return s;
}

export function calculateYearBan(year: number): BanPositions {
  const baseYear = 2026;
  const baseStar = 1; // 2026年は一白水星（2026/4/20実測確認）
  const diff = year - baseYear;
  let chuguStar = baseStar - diff;
  while (chuguStar < 1) chuguStar += 9;
  while (chuguStar > 9) chuguStar -= 9;
  return { chuguStar, positions: BAN_LAYOUT[chuguStar] as Record<Direction, number> };
}

export function calculateMonthBan(date: Date): BanPositions {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // 節月は各月の約6日頃から始まる（節気の近似値）
  const solarMonth = day >= 6 ? month : month === 1 ? 12 : month - 1;
  const solarYear = day < 6 && month === 1 ? year - 1 : year;

  // 基準: 2026年4月節月（清明〜）= 六白（2026/4/20実測確認）
  const refYear = 2026;
  const refMonth = 4;
  const refStar = 6;

  const monthDiff = (solarYear - refYear) * 12 + (solarMonth - refMonth);
  let chuguStar = refStar - monthDiff;
  while (chuguStar < 1) chuguStar += 9;
  while (chuguStar > 9) chuguStar -= 9;
  return { chuguStar, positions: BAN_LAYOUT[chuguStar] as Record<Direction, number> };
}

export function calculateDayBan(date: Date): BanPositions {
  const refDate = new Date(2026, 3, 20); // 2026/4/20 = 四緑木星（実測確認）
  const refStar = 4;
  const msPerDay = 1000 * 60 * 60 * 24;
  const diff = Math.round((date.getTime() - refDate.getTime()) / msPerDay);
  let chuguStar = refStar - diff;
  while (chuguStar < 1) chuguStar += 9;
  while (chuguStar > 9) chuguStar -= 9;
  return { chuguStar, positions: BAN_LAYOUT[chuguStar] as Record<Direction, number> };
}

export function calculateHourBan(date: Date): BanPositions {
  const dayBan = calculateDayBan(date);
  const startStar = [1, 4, 7].includes(dayBan.chuguStar) ? 8
    : [2, 5, 8].includes(dayBan.chuguStar) ? 2 : 5;
  const h = date.getHours();
  const hourIndex = (h === 23 || h === 0) ? 0 : Math.ceil(h / 2);
  const chuguStar = normStar(startStar - hourIndex);
  return { chuguStar, positions: BAN_LAYOUT[chuguStar] as Record<Direction, number> };
}
