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

function getJDN(date: Date): number {
  const Y = date.getFullYear();
  const M = date.getMonth() + 1;
  const D = date.getDate();
  const a = Math.floor((14 - M) / 12);
  const y = Y + 4800 - a;
  const m = M + 12 * a - 3;
  return D + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

function getDayZodiacIndex(date: Date): number {
  // 子=0, 丑=1, 寅=2, 卯=3, 辰=4, 巳=5, 午=6, 未=7, 申=8, 酉=9, 戌=10, 亥=11
  // 基準: 1900/1/1 (JDN 2415021) = 甲戌 (戌=10)
  return (getJDN(date) + 1) % 12;
}

function isYoton(date: Date): boolean {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  // 陽遁: 冬至(12/22頃)〜夏至(6/21頃)
  if (m >= 1 && m <= 5) return true;
  if (m === 6 && d <= 21) return true;
  if (m === 12 && d >= 22) return true;
  return false;
}

export function calculateHourBan(date: Date): BanPositions {
  const zodiacIndex = getDayZodiacIndex(date);
  const baseStar = [0, 3, 6, 9].includes(zodiacIndex) ? 1
    : [1, 4, 7, 10].includes(zodiacIndex) ? 4 : 7;

  const h = date.getHours();
  const tokiIndex = Math.floor((h + 1) / 2) % 12;

  let chuguStar: number;
  if (isYoton(date)) {
    chuguStar = ((baseStar + tokiIndex - 1) % 9) + 1;
  } else {
    chuguStar = ((baseStar - tokiIndex - 1 + 108) % 9) + 1;
  }
  return { chuguStar, positions: BAN_LAYOUT[chuguStar] as Record<Direction, number> };
}
