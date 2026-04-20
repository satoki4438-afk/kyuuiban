export type Direction = '北' | '北東' | '東' | '南東' | '南' | '南西' | '西' | '北西';
export type Gogyou = '水' | '木' | '火' | '土' | '金';
export type Gender = 'male' | 'female' | 'other';

export interface BanPositions {
  chuguStar: number;
  positions: Record<Direction, number>;
}

export interface StarInfo {
  id: number;
  name: string;
  kana: string;
  gogyou: Gogyou;
  direction: Direction | '中央';
  palace: string;
}

export interface HakkeInfo {
  id: string;
  name: string;
  direction: Direction;
  gogyou: Gogyou;
  note?: string;
}

export interface KyoHoi {
  goouSatsu: Direction;
  ankenSatsu: Direction;
  saiha: Direction;
  gappa: Direction;
  nippa: Direction;
}

export interface LuckyInfo {
  luckyDirections: Direction[];
  avoidDirections: Direction[];
  commonBad: KyoHoi;
}
