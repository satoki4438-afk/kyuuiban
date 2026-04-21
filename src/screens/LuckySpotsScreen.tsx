import React, { useState, useCallback, useMemo } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity,
  ActivityIndicator, Linking, Image, ScrollView,
} from 'react-native';
import * as Location from 'expo-location';
import { COLORS } from '../constants/colors';
import { useUserProfile } from '../hooks/useUserProfile';
import { calculateDayBan, calculateLuckyDirections } from '../lib/kyusei';
import { searchNearbySpots, getPhotoUrl } from '../lib/places/searchSpots';
import { formatDistance } from '../utils/bearing';
import type { Category, Spot } from '../lib/places/searchSpots';
import type { Direction } from '../lib/kyusei/types';

type DateMode = '今日' | '明日' | '今週末';
type DistMode = '徒歩' | '近' | '中' | '遠';

const DIST_CONFIG: Record<DistMode, number> = {
  '徒歩': 2000,
  '近': 10000,
  '中': 50000,
  '遠': 50000,
};

const CATEGORIES: Category[] = ['神社寺', 'カフェ', '公園', 'パワースポット', '温泉'];

const KIMON: Direction[] = ['北東', '南西'];

function getDateForMode(mode: DateMode): Date {
  const d = new Date();
  if (mode === '今日') return d;
  if (mode === '明日') { d.setDate(d.getDate() + 1); return d; }
  const dow = d.getDay();
  const daysToSat = (6 - dow + 7) % 7 || 7;
  d.setDate(d.getDate() + daysToSat);
  return d;
}

function Chip({
  label, active, onPress, warn,
}: { label: string; active: boolean; onPress: () => void; warn?: boolean }) {
  return (
    <TouchableOpacity
      style={[s.chip, active && s.chipActive, warn && s.chipWarn]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[s.chipText, active && s.chipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

function DirectionWarning({ directions, goouSatsu, ankenSatsu }: {
  directions: Direction[];
  goouSatsu: Direction;
  ankenSatsu: Direction;
}) {
  const bad = directions.filter(d => d === goouSatsu || d === ankenSatsu || KIMON.includes(d));
  if (bad.length === 0) return null;
  const labels = bad.map(d => {
    if (d === goouSatsu) return `${d}(五黄殺)`;
    if (d === ankenSatsu) return `${d}(暗剣殺)`;
    if (d === '北東') return `${d}(鬼門)`;
    if (d === '南西') return `${d}(裏鬼門)`;
    return d;
  });
  return (
    <View style={s.warnCard}>
      <Text style={s.warnTitle}>⚠ 凶方位注意</Text>
      <Text style={s.warnText}>{labels.join('・')}は凶方位です。移動は慎重に。</Text>
    </View>
  );
}

function SpotCard({ spot, onNav }: { spot: Spot; onNav: (spot: Spot) => void }) {
  return (
    <View style={s.card}>
      {spot.photoRef && (
        <Image source={{ uri: getPhotoUrl(spot.photoRef) }} style={s.cardImg} />
      )}
      <View style={s.cardBody}>
        <View style={s.cardRow}>
          <Text style={s.cardName} numberOfLines={1}>{spot.name}</Text>
          <View style={s.dirBadge}>
            <Text style={s.dirBadgeText}>{spot.direction}</Text>
          </View>
        </View>
        <Text style={s.cardVicinity} numberOfLines={1}>{spot.vicinity}</Text>
        <View style={s.cardFooter}>
          <Text style={s.cardDist}>{formatDistance(spot.distance)}</Text>
          {spot.rating != null && (
            <Text style={s.cardRating}>★ {spot.rating.toFixed(1)} ({spot.ratingsTotal})</Text>
          )}
          <TouchableOpacity style={s.navBtn} onPress={() => onNav(spot)} activeOpacity={0.8}>
            <Text style={s.navBtnText}>ナビ</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default function LuckySpotsScreen() {
  const profile = useUserProfile();
  const [dateMode, setDateMode] = useState<DateMode>('今日');
  const [distMode, setDistMode] = useState<DistMode>('近');
  const [category, setCategory] = useState<Category>('神社寺');
  const [spots, setSpots] = useState<Spot[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const luckyInfo = useMemo(() => {
    if (!profile) return null;
    const date = getDateForMode(dateMode);
    const ban = calculateDayBan(date);
    return calculateLuckyDirections(profile.honmeiSei, ban);
  }, [profile, dateMode]);

  const handleSearch = useCallback(async () => {
    if (!profile || !luckyInfo) return;
    setLoading(true);
    setErrMsg(null);
    setSpots([]);
    setSearched(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') { setErrMsg('位置情報の許可が必要です'); return; }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const results = await searchNearbySpots({
        location: { latitude: loc.coords.latitude, longitude: loc.coords.longitude },
        radiusM: DIST_CONFIG[distMode],
        category,
        luckyDirections: luckyInfo.luckyDirections,
      });
      setSpots(results);
    } catch (e: any) {
      setErrMsg(e?.message ?? '検索に失敗しました');
    } finally {
      setLoading(false);
    }
  }, [profile, luckyInfo, distMode, category]);

  const handleNav = useCallback((spot: Spot) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${spot.lat},${spot.lng}&travelmode=driving`;
    Linking.openURL(url);
  }, []);

  if (!profile) {
    return (
      <SafeAreaView style={s.container}>
        <View style={s.center}><Text style={s.subText}>読み込み中…</Text></View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.container}>
      <ScrollView stickyHeaderIndices={[0]} showsVerticalScrollIndicator={false}>
        <View style={s.header}>
          <Text style={s.title}>吉スポット検索</Text>
          {luckyInfo && luckyInfo.luckyDirections.length > 0 && (
            <Text style={s.luckyDirs}>
              吉方位: {luckyInfo.luckyDirections.join('・')}
            </Text>
          )}

          <View style={s.filterSection}>
            <Text style={s.filterLabel}>日付</Text>
            <View style={s.chipRow}>
              {(['今日', '明日', '今週末'] as DateMode[]).map(m => (
                <Chip key={m} label={m} active={dateMode === m} onPress={() => setDateMode(m)} />
              ))}
            </View>
          </View>

          <View style={s.filterSection}>
            <Text style={s.filterLabel}>距離</Text>
            <View style={s.chipRow}>
              {(['徒歩', '近', '中', '遠'] as DistMode[]).map(m => (
                <Chip key={m} label={m === '遠' ? '遠(〜50km)' : `${m}(${m === '徒歩' ? '2' : m === '近' ? '10' : '50'}km)`} active={distMode === m} onPress={() => setDistMode(m)} />
              ))}
            </View>
          </View>

          <View style={s.filterSection}>
            <Text style={s.filterLabel}>カテゴリ</Text>
            <View style={s.chipRow}>
              {CATEGORIES.map(c => (
                <Chip key={c} label={c} active={category === c} onPress={() => setCategory(c)} />
              ))}
            </View>
          </View>

          <TouchableOpacity style={s.searchBtn} onPress={handleSearch} activeOpacity={0.8}>
            <Text style={s.searchBtnText}>吉スポットを探す</Text>
          </TouchableOpacity>
        </View>

        {luckyInfo && (
          <DirectionWarning
            directions={luckyInfo.luckyDirections}
            goouSatsu={luckyInfo.commonBad.goouSatsu}
            ankenSatsu={luckyInfo.commonBad.ankenSatsu}
          />
        )}

        {loading && (
          <View style={s.center}>
            <ActivityIndicator size="large" color={COLORS.gold} />
            <Text style={s.subText}>検索中…</Text>
          </View>
        )}

        {errMsg && (
          <View style={s.center}><Text style={s.errText}>{errMsg}</Text></View>
        )}

        {!loading && searched && spots.length === 0 && !errMsg && (
          <View style={s.center}>
            <Text style={s.subText}>吉方位のスポットが見つかりませんでした</Text>
          </View>
        )}

        {spots.map(spot => (
          <SpotCard key={spot.id} spot={spot} onNav={handleNav} />
        ))}

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgPrimary },
  header: { backgroundColor: COLORS.bgPrimary, paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  title: { color: COLORS.gold, fontSize: 18, fontWeight: '700', letterSpacing: 1, marginBottom: 4 },
  luckyDirs: { color: COLORS.textSecondary, fontSize: 12, marginBottom: 12 },
  filterSection: { marginBottom: 10 },
  filterLabel: { color: COLORS.textSecondary, fontSize: 11, marginBottom: 6 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: {
    paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 16, borderWidth: 1, borderColor: '#3A2870',
    backgroundColor: COLORS.bgSecondary,
  },
  chipActive: { backgroundColor: COLORS.gold, borderColor: COLORS.gold },
  chipWarn: { borderColor: COLORS.ruby },
  chipText: { color: COLORS.textSecondary, fontSize: 12 },
  chipTextActive: { color: COLORS.bgPrimary, fontWeight: '600' },
  searchBtn: {
    marginTop: 8, backgroundColor: COLORS.gold, borderRadius: 10,
    paddingVertical: 12, alignItems: 'center',
  },
  searchBtnText: { color: COLORS.bgPrimary, fontSize: 15, fontWeight: '700' },
  warnCard: {
    marginHorizontal: 16, marginTop: 8, marginBottom: 4,
    backgroundColor: '#3B1A1A', borderRadius: 8, padding: 10,
    borderLeftWidth: 3, borderLeftColor: COLORS.ruby,
  },
  warnTitle: { color: COLORS.ruby, fontSize: 12, fontWeight: '700', marginBottom: 2 },
  warnText: { color: '#E88', fontSize: 12, lineHeight: 18 },
  center: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },
  subText: { color: COLORS.textSecondary, fontSize: 13, marginTop: 8 },
  errText: { color: COLORS.ruby, fontSize: 13 },
  card: {
    marginHorizontal: 16, marginTop: 10,
    backgroundColor: COLORS.bgSecondary, borderRadius: 12, overflow: 'hidden',
    flexDirection: 'row',
  },
  cardImg: { width: 80, height: 80 },
  cardBody: { flex: 1, padding: 10 },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 },
  cardName: { flex: 1, color: COLORS.textPrimary, fontSize: 14, fontWeight: '600' },
  dirBadge: {
    backgroundColor: '#3A2870', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2,
  },
  dirBadgeText: { color: COLORS.gold, fontSize: 10 },
  cardVicinity: { color: COLORS.textSecondary, fontSize: 11, marginBottom: 6 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cardDist: { color: COLORS.textSecondary, fontSize: 11 },
  cardRating: { flex: 1, color: COLORS.gold, fontSize: 11 },
  navBtn: {
    backgroundColor: '#1A6B3C', borderRadius: 6,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  navBtnText: { color: '#fff', fontSize: 12, fontWeight: '600' },
});
