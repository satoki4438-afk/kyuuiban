import type { StarInfo, HakkeInfo, Direction, Gogyou } from './types';

export const NINE_STARS: StarInfo[] = [
  { id: 1, name: '一白水星', kana: 'いっぱくすいせい', gogyou: '水', direction: '北', palace: '坎宮' },
  { id: 2, name: '二黒土星', kana: 'じこくどせい', gogyou: '土', direction: '南西', palace: '坤宮' },
  { id: 3, name: '三碧木星', kana: 'さんぺきもくせい', gogyou: '木', direction: '東', palace: '震宮' },
  { id: 4, name: '四緑木星', kana: 'しろくもくせい', gogyou: '木', direction: '南東', palace: '巽宮' },
  { id: 5, name: '五黄土星', kana: 'ごおうどせい', gogyou: '土', direction: '中央', palace: '中宮' },
  { id: 6, name: '六白金星', kana: 'ろっぱくきんせい', gogyou: '金', direction: '北西', palace: '乾宮' },
  { id: 7, name: '七赤金星', kana: 'しちせききんせい', gogyou: '金', direction: '西', palace: '兌宮' },
  { id: 8, name: '八白土星', kana: 'はっぱくどせい', gogyou: '土', direction: '北東', palace: '艮宮' },
  { id: 9, name: '九紫火星', kana: 'きゅうしかせい', gogyou: '火', direction: '南', palace: '離宮' },
];

export const HAKKE: HakkeInfo[] = [
  { id: 'kan', name: '坎', direction: '北', gogyou: '水' },
  { id: 'gon', name: '艮', direction: '北東', gogyou: '土', note: '鬼門' },
  { id: 'shin', name: '震', direction: '東', gogyou: '木' },
  { id: 'son', name: '巽', direction: '南東', gogyou: '木' },
  { id: 'ri', name: '離', direction: '南', gogyou: '火' },
  { id: 'kon', name: '坤', direction: '南西', gogyou: '土', note: '裏鬼門' },
  { id: 'da', name: '兌', direction: '西', gogyou: '金' },
  { id: 'ken', name: '乾', direction: '北西', gogyou: '金' },
];

export const ZODIAC_12 = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'] as const;

export const DIRECTION_ORDER: Direction[] = ['北', '北東', '東', '南東', '南', '南西', '西', '北西'];

export const OPPOSITE_DIRECTION: Record<Direction, Direction> = {
  '北': '南',
  '南': '北',
  '東': '西',
  '西': '東',
  '北東': '南西',
  '南西': '北東',
  '南東': '北西',
  '北西': '南東',
};

export const SEISHO_MAP: Record<Gogyou, Gogyou[]> = {
  '水': ['金', '水', '木'],
  '木': ['水', '木', '火'],
  '火': ['木', '火', '土'],
  '土': ['火', '土', '金'],
  '金': ['土', '金', '水'],
};

export const BAN_LAYOUT: Record<number, Record<Direction, number>> = {
  1: { '北': 1, '北東': 8, '東': 3, '南東': 4, '南': 9, '南西': 2, '西': 7, '北西': 6 },
  2: { '北': 9, '北東': 7, '東': 2, '南東': 3, '南': 8, '南西': 1, '西': 6, '北西': 5 },
  3: { '北': 8, '北東': 6, '東': 1, '南東': 2, '南': 7, '南西': 9, '西': 5, '北西': 4 },
  4: { '北': 7, '北東': 5, '東': 9, '南東': 1, '南': 6, '南西': 8, '西': 4, '北西': 3 },
  5: { '北': 6, '北東': 4, '東': 8, '南東': 9, '南': 5, '南西': 7, '西': 3, '北西': 2 },
  6: { '北': 5, '北東': 3, '東': 7, '南東': 8, '南': 4, '南西': 6, '西': 2, '北西': 1 },
  7: { '北': 4, '北東': 2, '東': 6, '南東': 7, '南': 3, '南西': 5, '西': 1, '北西': 9 },
  8: { '北': 3, '北東': 1, '東': 5, '南東': 6, '南': 2, '南西': 4, '西': 9, '北西': 8 },
  9: { '北': 2, '北東': 9, '東': 4, '南東': 5, '南': 1, '南西': 3, '西': 8, '北西': 7 },
};
