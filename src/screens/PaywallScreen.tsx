import React, { useEffect, useRef, useMemo } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity,
  ActivityIndicator, ScrollView, Animated, StatusBar, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Line, Polygon, Path, Rect, G } from 'react-native-svg';
import {
  useFonts,
  NotoSerifJP_400Regular,
  NotoSerifJP_700Bold,
} from '@expo-google-fonts/noto-serif-jp';
import { Purchases, ENTITLEMENT_ID } from '../lib/purchases';
import type { PurchasesPackage } from 'react-native-purchases';

const { width: SW } = Dimensions.get('window');

const C = {
  bg0: '#0D0820',
  bg1: '#1A0B2E',
  text: '#F0EDE8',
  textSub: '#9B8FA8',
  textHint: '#7A6E88',
  gold: '#C9A84C',
  goldLight: '#E8C96A',
  goldDark: '#A07830',
  borderNormal: 'rgba(201,168,76,0.2)',
  borderStrong: 'rgba(201,168,76,0.5)',
  cardBg: 'rgba(201,168,76,0.06)',
  iconBg: 'rgba(201,168,76,0.08)',
  featureBorder: 'rgba(201,168,76,0.1)',
  dimPurple: '#4A4060',
  featureText: '#C8C0D4',
};

// ---- SVG アイコン ----

function IconCompass() {
  return (
    <Svg width={18} height={18} viewBox="0 0 18 18">
      <Circle cx={9} cy={9} r={8} stroke={C.gold} strokeWidth={1} fill="none" />
      <Line x1={9} y1={1} x2={9} y2={4} stroke={C.gold} strokeWidth={1.2} />
      <Line x1={9} y1={14} x2={9} y2={17} stroke={C.gold} strokeWidth={1.2} />
      <Line x1={1} y1={9} x2={4} y2={9} stroke={C.gold} strokeWidth={1.2} />
      <Line x1={14} y1={9} x2={17} y2={9} stroke={C.gold} strokeWidth={1.2} />
      <Circle cx={9} cy={9} r={1.5} fill={C.gold} />
    </Svg>
  );
}

function IconGrid() {
  return (
    <Svg width={18} height={18} viewBox="0 0 18 18">
      <Rect x={1} y={1} width={16} height={16} rx={1} stroke={C.gold} strokeWidth={1} fill="none" />
      <Line x1={7} y1={1} x2={7} y2={17} stroke={C.gold} strokeWidth={0.8} />
      <Line x1={11} y1={1} x2={11} y2={17} stroke={C.gold} strokeWidth={0.8} />
      <Line x1={1} y1={7} x2={17} y2={7} stroke={C.gold} strokeWidth={0.8} />
      <Line x1={1} y1={11} x2={17} y2={11} stroke={C.gold} strokeWidth={0.8} />
      <Rect x={7} y={7} width={4} height={4} fill="rgba(201,168,76,0.3)" />
    </Svg>
  );
}

function IconClock() {
  return (
    <Svg width={18} height={18} viewBox="0 0 18 18">
      <Circle cx={9} cy={9} r={8} stroke={C.gold} strokeWidth={1} fill="none" />
      <Circle cx={9} cy={2} r={0.8} fill={C.gold} />
      <Line x1={9} y1={9} x2={9} y2={5} stroke={C.gold} strokeWidth={1.2} strokeLinecap="round" />
      <Line x1={9} y1={9} x2={12} y2={9} stroke={C.gold} strokeWidth={1.2} strokeLinecap="round" />
    </Svg>
  );
}

function IconStar() {
  return (
    <Svg width={18} height={18} viewBox="0 0 18 18">
      <Polygon
        points="9,1.5 11.2,6.6 16.8,7.1 12.7,10.8 14,16.3 9,13.4 4,16.3 5.3,10.8 1.2,7.1 6.8,6.6"
        stroke={C.gold} strokeWidth={0.8} fill="rgba(201,168,76,0.2)"
      />
    </Svg>
  );
}

function IconMoon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 18 18">
      <Path
        d="M13 9 A5 5 0 1 1 9 4 A4 4 0 1 0 13 9 Z"
        stroke={C.gold} strokeWidth={0.8} fill="rgba(201,168,76,0.15)"
      />
      <Line x1={9} y1={3} x2={9} y2={5} stroke={C.gold} strokeWidth={1} strokeLinecap="round" />
    </Svg>
  );
}

// ---- 八卦方位盤 SVG (回転アニメーション用) ----
function BaguaBase({ reverse }: { reverse?: boolean }) {
  const lines = Array.from({ length: 8 }, (_, i) => {
    const angle = (i * 45 * Math.PI) / 180;
    const x1 = 44 + 32 * Math.cos(angle);
    const y1 = 44 + 32 * Math.sin(angle);
    const x2 = 44 + 40 * Math.cos(angle);
    const y2 = 44 + 40 * Math.sin(angle);
    return <Line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.gold} strokeWidth={1} opacity={0.6} />;
  });

  const trigrams = Array.from({ length: 8 }, (_, i) => {
    const angle = (i * 45 * Math.PI) / 180;
    const cx = 44 + 24 * Math.cos(angle);
    const cy = 44 + 24 * Math.sin(angle);
    return (
      <G key={i}>
        <Line x1={cx - 5} y1={cy - 3} x2={cx + 5} y2={cy - 3} stroke={C.gold} strokeWidth={0.8} opacity={0.5} />
        <Line x1={cx - 5} y1={cy} x2={cx + 5} y2={cy} stroke={C.gold} strokeWidth={0.8} opacity={0.5} />
        <Line x1={cx - 5} y1={cy + 3} x2={cx + 5} y2={cy + 3} stroke={C.gold} strokeWidth={0.8} opacity={0.5} />
      </G>
    );
  });

  if (reverse) {
    return (
      <Svg width={88} height={88} viewBox="0 0 88 88">
        <Line x1={44} y1={30} x2={44} y2={58} stroke={C.gold} strokeWidth={0.4} opacity={0.3} />
        <Line x1={30} y1={44} x2={58} y2={44} stroke={C.gold} strokeWidth={0.4} opacity={0.3} />
        <Line x1={35} y1={35} x2={53} y2={53} stroke={C.gold} strokeWidth={0.4} opacity={0.3} />
        <Line x1={53} y1={35} x2={35} y2={53} stroke={C.gold} strokeWidth={0.4} opacity={0.3} />
        <Circle cx={44} cy={44} r={10} stroke={C.gold} strokeWidth={0.6} fill="none" opacity={0.4} />
        {trigrams}
        <Circle cx={44} cy={44} r={3} fill={C.gold} opacity={0.8} />
      </Svg>
    );
  }

  return (
    <Svg width={88} height={88} viewBox="0 0 88 88">
      <Circle cx={44} cy={44} r={42} stroke={C.gold} strokeWidth={0.8} fill="none" opacity={0.6} />
      <Circle cx={44} cy={44} r={38} stroke={C.gold} strokeWidth={0.4} fill="none" opacity={0.3} />
      {lines}
    </Svg>
  );
}

function RotatingBagua() {
  const outerSpin = useRef(new Animated.Value(0)).current;
  const innerSpin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(outerSpin, { toValue: 1, duration: 60000, useNativeDriver: true })
    ).start();
    Animated.loop(
      Animated.timing(innerSpin, { toValue: 1, duration: 30000, useNativeDriver: true })
    ).start();
  }, []);

  const outerRotate = outerSpin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const innerRotate = innerSpin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '-360deg'] });

  return (
    <View style={{ width: 88, height: 88 }}>
      <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ rotate: outerRotate }] }]}>
        <BaguaBase />
      </Animated.View>
      <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ rotate: innerRotate }] }]}>
        <BaguaBase reverse />
      </Animated.View>
    </View>
  );
}

// ---- 星のきらめき ----
const STARS = [
  { top: 0.08, left: 0.12, dur: 2800 },
  { top: 0.15, left: 0.82, dur: 3600 },
  { top: 0.32, left: 0.05, dur: 2200 },
  { top: 0.28, left: 0.91, dur: 4000 },
  { top: 0.55, left: 0.08, dur: 3200 },
  { top: 0.6, left: 0.88, dur: 2600 },
  { top: 0.78, left: 0.18, dur: 3800 },
  { top: 0.82, left: 0.75, dur: 2400 },
];

function TwinklingStars() {
  const anims = useRef(STARS.map(() => new Animated.Value(0.15))).current;

  useEffect(() => {
    anims.forEach((anim, i) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, { toValue: 0.8, duration: STARS[i].dur, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0.15, duration: STARS[i].dur, useNativeDriver: true }),
        ])
      ).start();
    });
  }, []);

  return (
    <>
      {STARS.map((s, i) => (
        <Animated.View
          key={i}
          style={{
            position: 'absolute',
            top: `${s.top * 100}%`,
            left: `${s.left * 100}%`,
            width: i % 2 === 0 ? 2 : 1.5,
            height: i % 2 === 0 ? 2 : 1.5,
            borderRadius: 1,
            backgroundColor: C.gold,
            opacity: anims[i],
          }}
        />
      ))}
    </>
  );
}

// ---- 機能リスト ----
const FEATURES = [
  { Icon: IconCompass, label: '八卦方位盤 × コンパス連動' },
  { Icon: IconGrid, label: '年・月・日・時の四盤完全対応' },
  { Icon: IconClock, label: '吉方位スポットをリアルタイム検索' },
  { Icon: IconStar, label: '本命星の詳細宿命診断' },
  { Icon: IconMoon, label: '毎朝7時の開運通知' },
];

// ---- メイン ----
export default function PaywallScreen() {
  const [fontsLoaded] = useFonts({ NotoSerifJP_400Regular, NotoSerifJP_700Bold });
  const [pkg, setPkg] = React.useState<PurchasesPackage | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [purchasing, setPurchasing] = React.useState(false);
  const [errMsg, setErrMsg] = React.useState<string | null>(null);

  useEffect(() => {
    Purchases.getOfferings()
      .then(o => setPkg(o.current?.monthly ?? null))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handlePurchase = async () => {
    if (!pkg) return;
    setPurchasing(true);
    setErrMsg(null);
    try {
      const { customerInfo } = await Purchases.purchasePackage(pkg);
      if (!customerInfo.entitlements.active[ENTITLEMENT_ID]) {
        setErrMsg('購入に失敗しました。再度お試しください。');
      }
    } catch (e: any) {
      if (!e.userCancelled) setErrMsg('購入に失敗しました。再度お試しください。');
    } finally {
      setPurchasing(false);
    }
  };

  const handleRestore = async () => {
    setPurchasing(true);
    try { await Purchases.restorePurchases(); } catch {}
    finally { setPurchasing(false); }
  };

  const serif = fontsLoaded ? 'NotoSerifJP_400Regular' : undefined;
  const serifBold = fontsLoaded ? 'NotoSerifJP_700Bold' : undefined;

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={[C.bg0, C.bg1, C.bg0]} style={StyleSheet.absoluteFill} />
      <TwinklingStars />

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* バッジ */}
        <View style={s.badge}>
          <Text style={[s.badgeText, { fontFamily: serif }]}>P R E M I U M</Text>
        </View>

        {/* 方位盤 */}
        <View style={s.baguaWrap}>
          <RotatingBagua />
        </View>

        {/* タイトル */}
        <Text style={[s.title, { fontFamily: serifBold }]}>運命の扉を、開く</Text>
        <Text style={[s.subtitle, { fontFamily: serif }]}>九星気学 × 風水 × 方位の本格占術</Text>

        {/* 区切り線 */}
        <LinearGradient
          colors={['transparent', C.gold, 'transparent']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={s.divider}
        />

        {/* 機能リスト */}
        <View style={s.featureList}>
          {FEATURES.map(({ Icon, label }, i) => (
            <View key={label} style={[s.featureRow, i < FEATURES.length - 1 && s.featureRowBorder]}>
              <View style={s.iconWrap}>
                <Icon />
              </View>
              <Text style={[s.featureText, { fontFamily: serif }]}>{label}</Text>
            </View>
          ))}
        </View>

        {/* 価格ボックス */}
        <View style={s.priceBox}>
          <Text style={[s.trialLabel, { fontFamily: serif }]}>7日間無料トライアル</Text>
          <View style={s.priceRow}>
            {loading
              ? <ActivityIndicator color={C.gold} />
              : <>
                  <Text style={[s.price, { fontFamily: serifBold }]}>
                    {pkg?.product.priceString ?? '¥480'}
                  </Text>
                  <Text style={[s.pricePer, { fontFamily: serif }]}> / 月</Text>
                </>
            }
          </View>
          <Text style={[s.priceNote, { fontFamily: serif }]}>いつでも解約可能 · 自動更新</Text>
        </View>

        {errMsg && <Text style={s.errText}>{errMsg}</Text>}

        {/* CTAボタン */}
        <TouchableOpacity
          onPress={handlePurchase}
          disabled={loading || purchasing}
          activeOpacity={0.85}
          style={s.ctaOuter}
        >
          <LinearGradient
            colors={[C.goldDark, C.gold, C.goldLight, C.gold, C.goldDark]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={s.ctaGradient}
          >
            {purchasing
              ? <ActivityIndicator color={C.bg0} />
              : <Text style={[s.ctaText, { fontFamily: serifBold }]}>無料で始める</Text>
            }
          </LinearGradient>
        </TouchableOpacity>

        {/* 復元ボタン */}
        <TouchableOpacity onPress={handleRestore} disabled={purchasing} style={s.restoreBtn}>
          <Text style={[s.restoreText, { fontFamily: serif }]}>購入を復元する</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg0 },
  scroll: { alignItems: 'center', paddingHorizontal: 24, paddingTop: 32, paddingBottom: 40 },
  badge: {
    borderWidth: 1, borderColor: 'rgba(201,168,76,0.6)',
    borderRadius: 20, paddingHorizontal: 16, paddingVertical: 5, marginBottom: 24,
  },
  badgeText: { color: C.gold, fontSize: 11, letterSpacing: 3 },
  baguaWrap: { width: 88, height: 88, marginBottom: 24 },
  title: { color: C.text, fontSize: 26, letterSpacing: 2, marginBottom: 10, textAlign: 'center' },
  subtitle: { color: C.textHint, fontSize: 12, letterSpacing: 2.5, marginBottom: 20, textAlign: 'center' },
  divider: { width: 48, height: 1, marginBottom: 24 },
  featureList: { width: '100%', marginBottom: 24 },
  featureRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 14,
  },
  featureRowBorder: { borderBottomWidth: 1, borderBottomColor: C.featureBorder },
  iconWrap: {
    width: 30, height: 30, borderRadius: 8,
    borderWidth: 1, borderColor: C.borderNormal,
    backgroundColor: C.iconBg,
    alignItems: 'center', justifyContent: 'center',
    marginRight: 14,
  },
  featureText: { color: C.featureText, fontSize: 13, letterSpacing: 0.5, flex: 1 },
  priceBox: {
    width: '100%', backgroundColor: C.cardBg,
    borderWidth: 1, borderColor: 'rgba(201,168,76,0.25)',
    borderRadius: 16, padding: 22, alignItems: 'center', marginBottom: 20,
  },
  trialLabel: { color: C.gold, fontSize: 11, letterSpacing: 2, marginBottom: 10 },
  priceRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 8 },
  price: { color: C.gold, fontSize: 44 },
  pricePer: { color: C.textSub, fontSize: 15, marginBottom: 6 },
  priceNote: { color: C.dimPurple, fontSize: 11, letterSpacing: 1 },
  errText: { color: '#E88', fontSize: 12, marginBottom: 8 },
  ctaOuter: { width: '100%', borderRadius: 14, overflow: 'hidden', marginBottom: 14 },
  ctaGradient: { height: 56, alignItems: 'center', justifyContent: 'center' },
  ctaText: { color: C.bg0, fontSize: 16, letterSpacing: 2.5 },
  restoreBtn: { paddingVertical: 8 },
  restoreText: { color: C.dimPurple, fontSize: 11, letterSpacing: 2 },
});
