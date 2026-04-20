import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView,
} from 'react-native';
import { COLORS } from '../constants/colors';
import { useCompass } from '../hooks/useCompass';
import { useUserProfile } from '../hooks/useUserProfile';
import {
  calculateYearBan, calculateMonthBan, calculateDayBan, calculateHourBan,
  calculateLuckyDirections,
} from '../lib/kyusei';
import HakkeHouiBan from '../components/HakkeHouiBan';
import CompassNeedle from '../components/CompassNeedle';
import { getHeadingDirectionName } from '../utils/fortune';
import Animated, { useAnimatedStyle, useDerivedValue } from 'react-native-reanimated';

type BanMode = '年盤' | '月盤' | '日盤' | '時盤';
const MODES: BanMode[] = ['年盤', '月盤', '日盤', '時盤'];

export default function CompassScreen() {
  const profile = useUserProfile();
  const compassHeading = useCompass();
  const [mode, setMode] = useState<BanMode>('日盤');
  const now = useMemo(() => new Date(), []);

  const ban = useMemo(() => {
    if (mode === '年盤') return calculateYearBan(now.getFullYear());
    if (mode === '月盤') return calculateMonthBan(now);
    if (mode === '時盤') return calculateHourBan(now);
    return calculateDayBan(now);
  }, [mode]);

  const { luckyDirections, avoidDirections } = useMemo(() => {
    if (!profile) return { luckyDirections: [], avoidDirections: [] };
    return calculateLuckyDirections(profile.honmeiSei, ban);
  }, [profile, ban]);

  const needleStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${-compassHeading.value}deg` }],
  }));

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>八卦方位盤</Text>

        <View style={styles.modeRow}>
          {MODES.map(m => (
            <TouchableOpacity
              key={m}
              style={[styles.modeBtn, mode === m && styles.modeBtnActive]}
              onPress={() => setMode(m)}
            >
              <Text style={[styles.modeBtnText, mode === m && styles.modeBtnTextActive]}>{m}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.banWrap}>
          <HakkeHouiBan
            ban={ban}
            luckyDirections={luckyDirections}
            avoidDirections={avoidDirections}
            size={300}
          />
          <Animated.View style={[styles.needleOverlay, needleStyle]} pointerEvents="none">
            <CompassNeedle size={80} />
          </Animated.View>
        </View>

        <View style={styles.legend}>
          {[
            { color: COLORS.gold, label: '吉方位' },
            { color: COLORS.ruby, label: '凶方位' },
            { color: COLORS.pinkRed, label: '鬼門・裏鬼門' },
            { color: COLORS.lavender, label: '普通' },
          ].map(({ color, label }) => (
            <View key={label} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: color }]} />
              <Text style={styles.legendText}>{label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.infoCards}>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>今の吉方位</Text>
            <Text style={styles.infoValue}>
              {luckyDirections.length > 0 ? luckyDirections.join('・') : 'なし'}
            </Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>避ける方位</Text>
            <Text style={[styles.infoValue, { color: COLORS.ruby }]}>
              {avoidDirections.length > 0 ? avoidDirections.join('・') : 'なし'}
            </Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>{mode}中宮</Text>
            <Text style={styles.infoValue}>{ban.chuguStar}星</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.ctaBtn}>
          <Text style={styles.ctaBtnText}>この方向の吉スポットを探す</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgPrimary },
  scroll: { alignItems: 'center', paddingVertical: 16, paddingHorizontal: 16 },
  title: { fontSize: 18, color: COLORS.gold, letterSpacing: 3, marginBottom: 16 },
  modeRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  modeBtn: {
    paddingVertical: 6, paddingHorizontal: 14,
    borderRadius: 16, borderWidth: 1, borderColor: COLORS.lavender,
  },
  modeBtnActive: { backgroundColor: COLORS.gold, borderColor: COLORS.gold },
  modeBtnText: { color: COLORS.textSecondary, fontSize: 13 },
  modeBtnTextActive: { color: COLORS.bgPrimary, fontWeight: '700' },
  banWrap: { marginBottom: 12, position: 'relative' },
  needleOverlay: {
    position: 'absolute',
    width: 80, height: 80,
    top: (300 - 80) / 2,
    left: (300 - 80) / 2,
  },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginBottom: 16 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { color: COLORS.textSecondary, fontSize: 11 },
  infoCards: { width: '100%', gap: 8, marginBottom: 20 },
  infoCard: {
    backgroundColor: COLORS.bgSecondary, borderRadius: 10,
    padding: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  infoLabel: { color: COLORS.textSecondary, fontSize: 13 },
  infoValue: { color: COLORS.gold, fontSize: 15, fontWeight: '600' },
  ctaBtn: {
    backgroundColor: COLORS.gold, borderRadius: 24,
    paddingVertical: 14, paddingHorizontal: 32, marginBottom: 24,
  },
  ctaBtnText: { color: COLORS.bgPrimary, fontSize: 14, fontWeight: '700' },
});
