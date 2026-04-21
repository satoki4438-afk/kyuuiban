import React, { useMemo } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
} from 'react-native';
import { COLORS } from '../constants/colors';
import { useUserProfile } from '../hooks/useUserProfile';
import {
  NINE_STARS, calculateYearBan, calculateMonthBan, calculateDayBan,
} from '../lib/kyusei';
import { STAR_PERSONALITY } from '../lib/kyusei/starPersonality';
import { getGogyouRelation } from '../utils/gogyou';
import type { Gogyou } from '../lib/kyusei/types';

const RATING_COLOR: Record<string, string> = {
  great: COLORS.gold,
  good: '#7EC8A0',
  normal: COLORS.textSecondary,
  caution: '#FFA040',
  bad: COLORS.ruby,
};

const RATING_LABEL: Record<string, string> = {
  great: '大吉', good: '吉', normal: '平', caution: '注意', bad: '凶',
};

function InfoRow({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <View style={info.row}>
      <Text style={info.label}>{label}</Text>
      <Text style={[info.value, accent && { color: COLORS.gold }]}>{value}</Text>
    </View>
  );
}

const info = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#3A2870' },
  label: { color: COLORS.textSecondary, fontSize: 13 },
  value: { color: COLORS.textPrimary, fontSize: 13, fontWeight: '500' },
});

function FortuneCard({ title, banLabel, relation }: { title: string; banLabel: string; relation: ReturnType<typeof getGogyouRelation> }) {
  const color = RATING_COLOR[relation.rating];
  return (
    <View style={fc.card}>
      <View style={fc.header}>
        <Text style={fc.title}>{title}</Text>
        <View style={[fc.badge, { borderColor: color }]}>
          <Text style={[fc.badgeText, { color }]}>{RATING_LABEL[relation.rating]}</Text>
        </View>
      </View>
      <Text style={fc.banLabel}>{banLabel}</Text>
      <Text style={fc.desc}>{relation.description}</Text>
    </View>
  );
}

const fc = StyleSheet.create({
  card: { backgroundColor: COLORS.bgSecondary, borderRadius: 12, padding: 14, marginBottom: 10 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  title: { color: COLORS.textSecondary, fontSize: 12 },
  badge: { borderWidth: 1, borderRadius: 4, paddingHorizontal: 8, paddingVertical: 2 },
  badgeText: { fontSize: 12, fontWeight: '700' },
  banLabel: { color: COLORS.textPrimary, fontSize: 13, marginBottom: 4 },
  desc: { color: COLORS.textSecondary, fontSize: 12, lineHeight: 18 },
});

export default function DestinyScreen() {
  const profile = useUserProfile();
  const now = useMemo(() => new Date(), []);

  const data = useMemo(() => {
    if (!profile) return null;
    const star = NINE_STARS[profile.honmeiSei - 1];
    const personality = STAR_PERSONALITY[profile.honmeiSei];

    const yearBan = calculateYearBan(now.getFullYear());
    const monthBan = calculateMonthBan(now);
    const yearCenterStar = NINE_STARS[yearBan.chuguStar - 1];
    const monthCenterStar = NINE_STARS[monthBan.chuguStar - 1];

    const yearRelation = getGogyouRelation(star.gogyou as Gogyou, yearCenterStar.gogyou as Gogyou);
    const monthRelation = getGogyouRelation(star.gogyou as Gogyou, monthCenterStar.gogyou as Gogyou);

    return { star, personality, yearBan, monthBan, yearCenterStar, monthCenterStar, yearRelation, monthRelation };
  }, [profile, now]);

  if (!profile || !data) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loading}>
          <Text style={styles.loadingText}>読み込み中…</Text>
        </View>
      </SafeAreaView>
    );
  }

  const { star, personality, yearBan, monthBan, yearCenterStar, monthCenterStar, yearRelation, monthRelation } = data;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.label}>あなたの宿命</Text>
        <Text style={styles.starName}>{star.name}</Text>
        <Text style={styles.catchcopy}>{personality.catchcopy}</Text>

        <View style={styles.card}>
          <InfoRow label="五行" value={star.gogyou} accent />
          <InfoRow label="定位" value={`${star.direction}（${star.palace}）`} />
          <InfoRow label="月命星" value="未実装（テーブル待ち）" />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>性格・特徴</Text>
          <Text style={styles.bodyText}>{personality.personality}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>強み・弱み</Text>
          <View style={styles.swRow}>
            <View style={styles.swBlock}>
              <Text style={styles.swLabel}>✦ 強み</Text>
              <Text style={styles.swText}>{personality.strength}</Text>
            </View>
            <View style={[styles.swBlock, { borderLeftWidth: StyleSheet.hairlineWidth, borderLeftColor: '#3A2870', paddingLeft: 12 }]}>
              <Text style={[styles.swLabel, { color: COLORS.ruby }]}>▽ 弱み</Text>
              <Text style={styles.swText}>{personality.weakness}</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>適職・天職</Text>
          <Text style={styles.bodyText}>{personality.career}</Text>
        </View>

        <Text style={styles.sectionHeader}>年運・月運</Text>

        <FortuneCard
          title={`${now.getFullYear()}年の運勢`}
          banLabel={`年盤中宮：${yearCenterStar.name}（${yearCenterStar.gogyou}）`}
          relation={yearRelation}
        />
        <FortuneCard
          title={`${now.getMonth() + 1}月の運勢`}
          banLabel={`月盤中宮：${monthCenterStar.name}（${monthCenterStar.gogyou}）`}
          relation={monthRelation}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgPrimary },
  scroll: { alignItems: 'center', paddingVertical: 24, paddingHorizontal: 16 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: COLORS.textSecondary, fontSize: 14 },
  label: { color: COLORS.textSecondary, fontSize: 11, letterSpacing: 3, marginBottom: 8 },
  starName: { color: COLORS.gold, fontSize: 32, fontWeight: '700', letterSpacing: 4, marginBottom: 8 },
  catchcopy: { color: COLORS.textSecondary, fontSize: 13, fontStyle: 'italic', marginBottom: 24, textAlign: 'center' },
  card: { width: '100%', backgroundColor: COLORS.bgSecondary, borderRadius: 12, padding: 14, marginBottom: 10 },
  sectionTitle: { color: COLORS.gold, fontSize: 11, letterSpacing: 2, marginBottom: 10 },
  bodyText: { color: COLORS.textPrimary, fontSize: 13, lineHeight: 20 },
  swRow: { flexDirection: 'row', gap: 12 },
  swBlock: { flex: 1 },
  swLabel: { color: COLORS.gold, fontSize: 11, marginBottom: 4 },
  swText: { color: COLORS.textPrimary, fontSize: 12, lineHeight: 18 },
  sectionHeader: { color: COLORS.textSecondary, fontSize: 11, letterSpacing: 3, marginTop: 8, marginBottom: 10 },
});
