import React, { useMemo, useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView, ActivityIndicator,
} from 'react-native';
import Animated, {
  useSharedValue, withTiming, useAnimatedStyle, Easing,
} from 'react-native-reanimated';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase/config';
import { getCachedMessage, cacheMessage } from '../lib/firebase/fortuneCache';
import { generateFortuneMessage } from '../lib/claude/generateFortune';
import { COLORS } from '../constants/colors';
import { useUserProfile } from '../hooks/useUserProfile';
import {
  calculateDayBan, calculateLuckyDirections, NINE_STARS,
} from '../lib/kyusei';
import { calculateFortuneScores, STAR_LUCKY_INFO } from '../utils/fortune';

const SCORE_LABELS = [
  { key: 'love' as const, label: '恋愛運' },
  { key: 'money' as const, label: '金運' },
  { key: 'work' as const, label: '仕事運' },
  { key: 'health' as const, label: '健康運' },
];

function ScoreBar({ label, value }: { label: string; value: number }) {
  const width = useSharedValue(0);
  useEffect(() => {
    width.value = withTiming(value, { duration: 800, easing: Easing.out(Easing.quad) });
  }, [value]);
  const barStyle = useAnimatedStyle(() => ({ width: `${width.value}%` as `${number}%` }));
  return (
    <View style={bar.row}>
      <Text style={bar.label}>{label}</Text>
      <View style={bar.track}>
        <Animated.View style={[bar.fill, barStyle]} />
      </View>
      <Text style={bar.value}>{value}</Text>
    </View>
  );
}

const bar = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  label: { width: 48, color: COLORS.textSecondary, fontSize: 12 },
  track: { flex: 1, height: 6, backgroundColor: '#3A2870', borderRadius: 3, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: COLORS.gold, borderRadius: 3 },
  value: { width: 30, color: COLORS.gold, fontSize: 11, textAlign: 'right' },
});

function TotalScore({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let cur = 0;
    const step = value / 30;
    const id = setInterval(() => {
      cur += step;
      if (cur >= value) { setDisplay(value); clearInterval(id); }
      else setDisplay(Math.floor(cur));
    }, 26);
    return () => clearInterval(id);
  }, [value]);
  return <Text style={styles.totalScore}>{display}</Text>;
}

export default function TodayScreen() {
  const profile = useUserProfile();
  const now = useMemo(() => new Date(), []);
  const [message, setMessage] = useState<string | null>(null);
  const [msgLoading, setMsgLoading] = useState(false);

  const { ban, lucky, scores, dayStarInfo, luckyInfo, honmeiStar } = useMemo(() => {
    const ban = calculateDayBan(now);
    const lucky = profile
      ? calculateLuckyDirections(profile.honmeiSei, ban)
      : { luckyDirections: [], avoidDirections: [] };
    const scores = profile
      ? calculateFortuneScores(profile.honmeiSei, now, lucky.luckyDirections.length)
      : { total: 0, love: 0, money: 0, work: 0, health: 0 };
    return {
      ban,
      lucky,
      scores,
      dayStarInfo: NINE_STARS[ban.chuguStar - 1],
      luckyInfo: STAR_LUCKY_INFO[ban.chuguStar],
      honmeiStar: profile ? NINE_STARS[profile.honmeiSei - 1] : null,
    };
  }, [profile, now]);

  useEffect(() => {
    if (!profile) return;
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return;
      setMsgLoading(true);
      try {
        const cached = await getCachedMessage();
        if (cached) {
          setMessage(cached);
          return;
        }
        const dateLabel = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`;
        const generated = await generateFortuneMessage({
          starName: honmeiStar?.name ?? '',
          gogyou: honmeiStar?.gogyou ?? '',
          totalScore: scores.total,
          luckyDirection: lucky.luckyDirections[0] ?? 'なし',
          dateLabel,
        });
        setMessage(generated);
        await cacheMessage(generated);
      } catch {
        setMessage(null);
      } finally {
        setMsgLoading(false);
      }
    });
    return () => unsub();
  }, [profile, scores.total]);

  const dateStr = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`;

  if (!profile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loading}>
          <Text style={styles.loadingText}>読み込み中…</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.name}>{profile.name} さん</Text>
        <Text style={styles.honmei}>{honmeiStar?.name}</Text>
        <Text style={styles.date}>{dateStr}</Text>

        <View style={styles.totalWrap}>
          <Text style={styles.totalLabel}>総合運</Text>
          <TotalScore value={scores.total} />
          <Text style={styles.totalUnit}>点</Text>
        </View>

        <View style={styles.barsCard}>
          {SCORE_LABELS.map(({ key, label }) => (
            <ScoreBar key={key} label={label} value={scores[key]} />
          ))}
        </View>

        <View style={styles.luckyRow}>
          <View style={styles.luckyItem}>
            <Text style={styles.luckyLabel}>ラッキーカラー</Text>
            <View style={[styles.colorDot, { backgroundColor: luckyInfo.colorHex }]} />
            <Text style={styles.luckyValue}>{luckyInfo.color}</Text>
          </View>
          <View style={styles.luckyItem}>
            <Text style={styles.luckyLabel}>ラッキーアイテム</Text>
            <Text style={styles.luckyValue}>{luckyInfo.item}</Text>
          </View>
          <View style={styles.luckyItem}>
            <Text style={styles.luckyLabel}>吉方位</Text>
            <Text style={[styles.luckyValue, { color: COLORS.gold }]}>
              {lucky.luckyDirections[0] ?? 'なし'}
            </Text>
          </View>
        </View>

        <View style={styles.messageCard}>
          <Text style={styles.messageLabel}>今日のお告げ</Text>
          {msgLoading ? (
            <View style={styles.msgLoading}>
              <ActivityIndicator size="small" color={COLORS.gold} />
              <Text style={styles.msgLoadingText}>お告げを受信中…</Text>
            </View>
          ) : (
            <Text style={styles.messageText}>
              {message ?? `今日の中宮は${dayStarInfo.name}。${dayStarInfo.gogyou}の気が満ちる一日です。${lucky.luckyDirections[0] ? `${lucky.luckyDirections[0]}の方角に運気が宿っています。` : '内なる力を信じて静かに過ごしましょう。'}`}
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgPrimary },
  scroll: { alignItems: 'center', paddingVertical: 20, paddingHorizontal: 20 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: COLORS.textSecondary, fontSize: 14 },
  name: { color: COLORS.textSecondary, fontSize: 13, marginBottom: 2 },
  honmei: { color: COLORS.gold, fontSize: 16, fontWeight: '600', letterSpacing: 2, marginBottom: 4 },
  date: { color: COLORS.textSecondary, fontSize: 12, marginBottom: 28 },
  totalWrap: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 28 },
  totalLabel: { color: COLORS.textSecondary, fontSize: 14, marginBottom: 12, marginRight: 12 },
  totalScore: { color: COLORS.gold, fontSize: 72, fontWeight: '700', lineHeight: 80 },
  totalUnit: { color: COLORS.textSecondary, fontSize: 16, marginBottom: 12, marginLeft: 4 },
  barsCard: {
    width: '100%', backgroundColor: COLORS.bgSecondary,
    borderRadius: 12, padding: 16, marginBottom: 16,
  },
  luckyRow: { width: '100%', flexDirection: 'row', gap: 8, marginBottom: 16 },
  luckyItem: {
    flex: 1, backgroundColor: COLORS.bgSecondary,
    borderRadius: 10, padding: 12, alignItems: 'center',
  },
  luckyLabel: { color: COLORS.textSecondary, fontSize: 10, marginBottom: 6, textAlign: 'center' },
  luckyValue: { color: COLORS.textPrimary, fontSize: 13, fontWeight: '600', textAlign: 'center' },
  colorDot: { width: 18, height: 18, borderRadius: 9, marginBottom: 4 },
  messageCard: {
    width: '100%', backgroundColor: COLORS.bgSecondary,
    borderRadius: 12, padding: 16, marginBottom: 24,
  },
  messageLabel: { color: COLORS.gold, fontSize: 11, marginBottom: 8, letterSpacing: 2 },
  messageText: { color: COLORS.textPrimary, fontSize: 14, lineHeight: 22 },
  msgLoading: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 4 },
  msgLoadingText: { color: COLORS.textSecondary, fontSize: 13 },
});
