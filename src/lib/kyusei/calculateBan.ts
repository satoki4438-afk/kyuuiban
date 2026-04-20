import type { BanPositions, Direction } from './types';
import { BAN_LAYOUT, DIRECTION_ORDER } from './constants';

export function calculateYearBan(year: number): BanPositions {
  const baseYear = 2025;
  const baseStar = 4;
  const diff = year - baseYear;
  let chuguStar = baseStar - diff;
  while (chuguStar < 1) chuguStar += 9;
  while (chuguStar > 9) chuguStar -= 9;

  return {
    chuguStar,
    positions: BAN_LAYOUT[chuguStar] as Record<Direction, number>,
  };
}

export function calculateMonthBan(year: number, month: number): BanPositions {
  const baseYear = 2025;
  const baseMonth = 1;
  const baseStar = 8;

  const totalMonths = (year - baseYear) * 12 + (month - baseMonth);
  let chuguStar = baseStar - totalMonths;
  while (chuguStar < 1) chuguStar += 9;
  while (chuguStar > 9) chuguStar -= 9;

  return {
    chuguStar,
    positions: BAN_LAYOUT[chuguStar] as Record<Direction, number>,
  };
}

export function calculateDayBan(date: Date): BanPositions {
  const base = new Date(2025, 0, 1);
  const diff = Math.floor((date.getTime() - base.getTime()) / (1000 * 60 * 60 * 24));
  const baseStar = 3;
  let chuguStar = baseStar - diff;
  while (chuguStar < 1) chuguStar += 9;
  while (chuguStar > 9) chuguStar -= 9;

  return {
    chuguStar,
    positions: BAN_LAYOUT[chuguStar] as Record<Direction, number>,
  };
}
