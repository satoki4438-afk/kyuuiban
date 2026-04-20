import React, { memo } from 'react';
import Svg, { Path, Circle, Text as SvgText, G, Polygon } from 'react-native-svg';
import type { BanPositions, Direction } from '../lib/kyusei/types';
import { COLORS } from '../constants/colors';
import NineStarBan from './NineStarBan';

const CX = 150;
const CY = 150;
const R_OUTER = 142;
const R_HAKKE_O = 128;
const R_HAKKE_I = 104;
const R_SEG_O = 104;
const R_SEG_I = 50;

interface DirInfo {
  dir: Direction;
  angle: number;
  hakke: string;
  isKimon?: boolean;
  isUraKimon?: boolean;
}

const DIR_INFO: DirInfo[] = [
  { dir: '北', angle: 0, hakke: '坎' },
  { dir: '北東', angle: 45, hakke: '艮', isKimon: true },
  { dir: '東', angle: 90, hakke: '震' },
  { dir: '南東', angle: 135, hakke: '巽' },
  { dir: '南', angle: 180, hakke: '離' },
  { dir: '南西', angle: 225, hakke: '坤', isUraKimon: true },
  { dir: '西', angle: 270, hakke: '兌' },
  { dir: '北西', angle: 315, hakke: '乾' },
];

function polar(r: number, deg: number) {
  const rad = (deg - 90) * Math.PI / 180;
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
}

function arc(r1: number, r2: number, s: number, e: number): string {
  const p1 = polar(r2, s), p2 = polar(r2, e);
  const p3 = polar(r1, e), p4 = polar(r1, s);
  const lg = e - s > 180 ? 1 : 0;
  return `M${p1.x.toFixed(1)} ${p1.y.toFixed(1)} A${r2} ${r2} 0 ${lg} 1 ${p2.x.toFixed(1)} ${p2.y.toFixed(1)} L${p3.x.toFixed(1)} ${p3.y.toFixed(1)} A${r1} ${r1} 0 ${lg} 0 ${p4.x.toFixed(1)} ${p4.y.toFixed(1)} Z`;
}

function segColor(dir: Direction, lucky: Direction[], avoid: Direction[], kimon?: boolean, ura?: boolean): string {
  if (kimon || ura) return COLORS.pinkRed;
  if (lucky.includes(dir)) return COLORS.gold;
  if (avoid.includes(dir)) return COLORS.ruby;
  return COLORS.lavender;
}

interface Props {
  ban: BanPositions;
  luckyDirections: Direction[];
  avoidDirections: Direction[];
  size?: number;
}

function HakkeHouiBan({ ban, luckyDirections, avoidDirections, size = 300 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 300 300">
      <Circle cx={CX} cy={CY} r={R_OUTER} fill={COLORS.bgSecondary} />

      {DIR_INFO.map(({ dir, angle, isKimon, isUraKimon }) => {
        const s = angle - 22.5, e = angle + 22.5;
        const color = segColor(dir, luckyDirections, avoidDirections, isKimon, isUraKimon);
        const lp = polar(77, angle);
        return (
          <G key={dir}>
            <Path d={arc(R_SEG_I, R_SEG_O, s, e)} fill={color} fillOpacity={0.3}
              stroke={COLORS.gold} strokeWidth={0.5} strokeOpacity={0.4} />
            <SvgText x={lp.x} y={lp.y + 5} fontSize={13} fontWeight="600"
              fill={color} textAnchor="middle">
              {ban.positions[dir]}
            </SvgText>
          </G>
        );
      })}

      {DIR_INFO.map(({ dir, angle, hakke, isKimon, isUraKimon }) => {
        const s = angle - 22.5, e = angle + 22.5;
        const color = segColor(dir, luckyDirections, avoidDirections, isKimon, isUraKimon);
        const hp = polar(116, angle);
        return (
          <G key={`h-${dir}`}>
            <Path d={arc(R_HAKKE_I, R_HAKKE_O, s, e)} fill={color} fillOpacity={0.2}
              stroke={COLORS.gold} strokeWidth={0.5} strokeOpacity={0.35} />
            <SvgText x={hp.x} y={hp.y + 5} fontSize={11}
              fill={isKimon || isUraKimon ? COLORS.pinkRed : COLORS.textSecondary}
              textAnchor="middle">
              {hakke}
            </SvgText>
          </G>
        );
      })}

      <Circle cx={CX} cy={CY} r={R_OUTER} fill="none" stroke={COLORS.gold} strokeWidth={2} />
      <Circle cx={CX} cy={CY} r={R_HAKKE_O} fill="none" stroke={COLORS.gold} strokeWidth={0.5} strokeOpacity={0.5} />
      <Circle cx={CX} cy={CY} r={R_SEG_O} fill="none" stroke={COLORS.gold} strokeWidth={0.5} strokeOpacity={0.5} />
      <Circle cx={CX} cy={CY} r={R_SEG_I} fill="none" stroke={COLORS.gold} strokeWidth={0.5} strokeOpacity={0.5} />

      <SvgText x={polar(136, 45).x} y={polar(136, 45).y + 4}
        fontSize={7} fill={COLORS.pinkRed} textAnchor="middle">鬼門</SvgText>
      <SvgText x={polar(136, 225).x} y={polar(136, 225).y + 4}
        fontSize={7} fill={COLORS.pinkRed} textAnchor="middle">裏鬼</SvgText>

      <NineStarBan ban={ban} cx={CX} cy={CY} cellSize={22} />

      <SvgText x={CX} y={CY - R_OUTER + 13} fontSize={9} fill={COLORS.gold}
        textAnchor="middle" fontWeight="700">N</SvgText>
    </Svg>
  );
}

export default memo(HakkeHouiBan);
