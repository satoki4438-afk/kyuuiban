export interface FortuneScores {
  total: number;
  love: number;
  money: number;
  work: number;
  health: number;
}

function det(n: number): number {
  const x = Math.sin(n + 1) * 10000;
  return x - Math.floor(x);
}

export function calculateFortuneScores(
  honmeiSei: number,
  date: Date,
  luckyCount: number,
): FortuneScores {
  const s = honmeiSei * (date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate());
  const bonus = luckyCount * 4;
  return {
    total: Math.min(100, Math.floor(52 + det(s) * 28 + bonus)),
    love: Math.min(100, Math.floor(50 + det(s + 1) * 40)),
    money: Math.min(100, Math.floor(50 + det(s + 2) * 40)),
    work: Math.min(100, Math.floor(50 + det(s + 3) * 40)),
    health: Math.min(100, Math.floor(50 + det(s + 4) * 40)),
  };
}

export const STAR_LUCKY_INFO: Record<number, { color: string; colorHex: string; item: string }> = {
  1: { color: '白', colorHex: '#E0E0E0', item: '水晶' },
  2: { color: '黒', colorHex: '#616161', item: '陶器' },
  3: { color: '緑', colorHex: '#4CAF50', item: '観葉植物' },
  4: { color: '緑', colorHex: '#8BC34A', item: '風鈴' },
  5: { color: '黄', colorHex: '#FFC107', item: '土物' },
  6: { color: '金', colorHex: '#D4AF37', item: '金属小物' },
  7: { color: '赤', colorHex: '#EF5350', item: '鏡' },
  8: { color: '白', colorHex: '#BDBDBD', item: '石' },
  9: { color: '紫', colorHex: '#B794F4', item: 'ろうそく' },
};

export function getHeadingDirectionName(headingDeg: number): string {
  const dirs = ['北', '北東', '東', '南東', '南', '南西', '西', '北西'];
  return dirs[Math.round(((headingDeg + 22.5) % 360) / 45) % 8];
}
