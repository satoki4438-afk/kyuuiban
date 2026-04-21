import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity,
  ActivityIndicator, ScrollView,
} from 'react-native';
import { Purchases, ENTITLEMENT_ID } from '../lib/purchases';
import type { PurchasesPackage } from 'react-native-purchases';
import { COLORS } from '../constants/colors';

const FEATURES = [
  { icon: '🧭', label: '八卦方位盤', desc: '吉凶方位をリアルタイム表示' },
  { icon: '📍', label: '吉スポット検索', desc: 'Google Mapsと連携した吉地点発見' },
  { icon: '★', label: '本命星詳細', desc: '性格・適職・年運・月運を詳しく確認' },
];

export default function PaywallScreen() {
  const [pkg, setPkg] = useState<PurchasesPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  useEffect(() => {
    Purchases.getOfferings()
      .then(offerings => {
        const monthly = offerings.current?.monthly ?? null;
        setPkg(monthly);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handlePurchase = async () => {
    if (!pkg) return;
    setPurchasing(true);
    setErrMsg(null);
    try {
      const { customerInfo } = await Purchases.purchasePackage(pkg);
      if (customerInfo.entitlements.active[ENTITLEMENT_ID]) {
        // subscription active — parent component will re-render via useSubscription listener
      }
    } catch (e: any) {
      if (!e.userCancelled) setErrMsg('購入に失敗しました。再度お試しください。');
    } finally {
      setPurchasing(false);
    }
  };

  const handleRestore = async () => {
    setPurchasing(true);
    try {
      await Purchases.restorePurchases();
    } catch {
    } finally {
      setPurchasing(false);
    }
  };

  return (
    <SafeAreaView style={s.container}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        <Text style={s.orb}>✦</Text>
        <Text style={s.title}>九気盤 プレミアム</Text>
        <Text style={s.subtitle}>宇宙の意志を、あなたの手に。</Text>

        <View style={s.trialBadge}>
          <Text style={s.trialText}>7日間 無料トライアル</Text>
        </View>

        <View style={s.featureList}>
          {FEATURES.map(f => (
            <View key={f.label} style={s.featureRow}>
              <Text style={s.featureIcon}>{f.icon}</Text>
              <View style={s.featureBody}>
                <Text style={s.featureLabel}>{f.label}</Text>
                <Text style={s.featureDesc}>{f.desc}</Text>
              </View>
              <Text style={s.check}>✓</Text>
            </View>
          ))}
        </View>

        <View style={s.priceCard}>
          {loading ? (
            <ActivityIndicator color={COLORS.gold} />
          ) : (
            <>
              <Text style={s.priceLabel}>月額</Text>
              <Text style={s.price}>
                {pkg?.product.priceString ?? '¥480'}
              </Text>
              <Text style={s.priceSub}>7日間無料 → その後自動更新</Text>
            </>
          )}
        </View>

        {errMsg && <Text style={s.errText}>{errMsg}</Text>}

        <TouchableOpacity
          style={[s.purchaseBtn, (loading || purchasing) && s.purchaseBtnDisabled]}
          onPress={handlePurchase}
          disabled={loading || purchasing}
          activeOpacity={0.8}
        >
          {purchasing
            ? <ActivityIndicator color={COLORS.bgPrimary} />
            : <Text style={s.purchaseBtnText}>7日間 無料で試す</Text>
          }
        </TouchableOpacity>

        <TouchableOpacity onPress={handleRestore} disabled={purchasing} style={s.restoreBtn}>
          <Text style={s.restoreText}>購入を復元する</Text>
        </TouchableOpacity>

        <Text style={s.legal}>
          トライアル終了後、¥480/月が自動課金されます。{'\n'}
          いつでも設定からキャンセル可能です。
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgPrimary },
  scroll: { alignItems: 'center', paddingVertical: 32, paddingHorizontal: 24 },
  orb: { fontSize: 48, color: COLORS.gold, marginBottom: 8 },
  title: { color: COLORS.gold, fontSize: 22, fontWeight: '700', letterSpacing: 2, marginBottom: 6 },
  subtitle: { color: COLORS.textSecondary, fontSize: 13, marginBottom: 20 },
  trialBadge: {
    backgroundColor: '#3A2870', borderRadius: 20, paddingHorizontal: 18, paddingVertical: 6,
    borderWidth: 1, borderColor: COLORS.gold, marginBottom: 28,
  },
  trialText: { color: COLORS.gold, fontSize: 13, fontWeight: '700' },
  featureList: { width: '100%', marginBottom: 24 },
  featureRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.bgSecondary, borderRadius: 10,
    padding: 14, marginBottom: 8,
  },
  featureIcon: { fontSize: 22, marginRight: 12 },
  featureBody: { flex: 1 },
  featureLabel: { color: COLORS.textPrimary, fontSize: 14, fontWeight: '600', marginBottom: 2 },
  featureDesc: { color: COLORS.textSecondary, fontSize: 11 },
  check: { color: COLORS.gold, fontSize: 18, fontWeight: '700' },
  priceCard: {
    width: '100%', backgroundColor: COLORS.bgSecondary, borderRadius: 14,
    padding: 20, alignItems: 'center', marginBottom: 20,
    borderWidth: 1, borderColor: '#3A2870',
  },
  priceLabel: { color: COLORS.textSecondary, fontSize: 12, marginBottom: 4 },
  price: { color: COLORS.gold, fontSize: 36, fontWeight: '700', marginBottom: 4 },
  priceSub: { color: COLORS.textSecondary, fontSize: 11 },
  errText: { color: '#E88', fontSize: 12, marginBottom: 8 },
  purchaseBtn: {
    width: '100%', backgroundColor: COLORS.gold, borderRadius: 14,
    paddingVertical: 16, alignItems: 'center', marginBottom: 12,
  },
  purchaseBtnDisabled: { opacity: 0.5 },
  purchaseBtnText: { color: COLORS.bgPrimary, fontSize: 16, fontWeight: '700' },
  restoreBtn: { paddingVertical: 8, marginBottom: 16 },
  restoreText: { color: COLORS.textSecondary, fontSize: 12, textDecorationLine: 'underline' },
  legal: { color: '#555', fontSize: 10, textAlign: 'center', lineHeight: 16 },
});
