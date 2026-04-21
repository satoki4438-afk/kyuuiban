import type { Gogyou } from '../lib/kyusei/types';

const GENERATES: Record<Gogyou, Gogyou> = {
  '木': '火', '火': '土', '土': '金', '金': '水', '水': '木',
};
const CONTROLS: Record<Gogyou, Gogyou> = {
  '木': '土', '土': '水', '水': '火', '火': '金', '金': '木',
};

export interface GogyouRelation {
  label: string;
  rating: 'great' | 'good' | 'normal' | 'caution' | 'bad';
  description: string;
}

export function getGogyouRelation(myGogyou: Gogyou, otherGogyou: Gogyou): GogyouRelation {
  if (GENERATES[otherGogyou] === myGogyou) {
    return { label: '生気', rating: 'great', description: '運気に勢いがあり、成長と発展が期待できます。' };
  }
  if (myGogyou === otherGogyou) {
    return { label: '比和', rating: 'good', description: '安定した流れの中で力を蓄えられます。' };
  }
  if (GENERATES[myGogyou] === otherGogyou) {
    return { label: '退気', rating: 'caution', description: '消耗しやすい時期。無理をせず蓄える意識を。' };
  }
  if (CONTROLS[otherGogyou] === myGogyou) {
    return { label: '殺気', rating: 'bad', description: '逆風の時期。慎重に行動し吉方位を活用しましょう。' };
  }
  return { label: '死気', rating: 'normal', description: '静かに力を温める時期です。' };
}
