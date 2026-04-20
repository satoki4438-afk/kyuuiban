# Claude Code への指示書（コードくん依頼書）

**プロジェクト**: 九星気学 × 風水アプリ
**コード名**: 九気盤（きゅうきばん）
**依頼者**: TAS Studio（さとき）
**ベース仕様書**: `spec.md`

---

## 🎯 このプロジェクトで作るもの

九星気学をベースにした占いアプリ。最大の特徴は**八卦方位盤がスマホのコンパスと連動**し、**今向いている方角の吉方位にある神社・カフェ・パワースポットを検索**できること。

**無料機能**：今日の運勢のみ
**課金機能（¥480/月）**：方位盤・吉スポット検索・本命星詳細診断・月間運勢

---

## 🚨 最重要：必ず守ってほしいこと（global CLAUDE.md に準ずる）

1. **指示されていない機能は勝手に追加しない**
2. **迷ったら手を止めて確認を取る**（勝手に進めない）
3. **既存のコンポーネントを確認してから新規作成**
4. **コミットは機能単位で細かく**
5. **何か削除・変更する時は事前に確認**
6. 日本語で会話してOK、コードは英語でOK

---

## 📋 Phase 1: MVP の開発スコープ

### 機能リスト

1. オンボーディング（生年月日・性別・名前入力）
2. 今日の運勢画面（無料）
3. 八卦方位盤×コンパス画面（課金）
4. 吉スポット検索画面（課金）
5. 本命星診断画面（課金）
6. 設定画面
7. サブスク決済（¥480/月）

### 含めない機能（Phase 2以降）

- 相性診断
- 風水インテリア詳細
- 四柱推命
- AIチャット
- 引越し物件検索

---

## 🛠 技術スタック

### 必須

- **React Native + Expo**（SDK 最新）
- **TypeScript**（strict mode）
- **React Navigation**（tabs + stack）
- **React Native Reanimated 3**（盤のアニメ）
- **React Native SVG**（八卦盤描画）
- **expo-sensors**（Magnetometer）
- **expo-location**
- **Firebase**（Auth / Firestore / Functions / FCM）
- **RevenueCat**（サブスク）
- **Claude API**（Haiku 4.5）
- **Google Places API**
- **Google Maps API**

### ディレクトリ構成

```
src/
├── screens/
│   ├── OnboardingScreen.tsx
│   ├── TodayScreen.tsx           // 今日の運勢
│   ├── CompassScreen.tsx         // 八卦方位盤
│   ├── LuckySpotsScreen.tsx     // 吉スポット検索
│   ├── DestinyScreen.tsx         // 本命星診断
│   └── SettingsScreen.tsx
├── components/
│   ├── HakkeHouiBan.tsx         // 八卦方位盤 SVG
│   ├── NineStarBan.tsx          // 九星盤 3x3
│   ├── CompassNeedle.tsx
│   ├── FortuneCard.tsx
│   └── ...
├── lib/
│   ├── kyusei/
│   │   ├── calculateHonmeiSei.ts    // 本命星計算
│   │   ├── calculateGetsumeiSei.ts   // 月命星計算
│   │   ├── calculateBan.ts           // 年/月/日/時盤計算
│   │   ├── calculateLuckyDirections.ts
│   │   ├── constants.ts              // 九星一覧、十二支、八卦定位
│   │   └── types.ts
│   ├── firebase/
│   ├── revenuecat/
│   └── claude/
├── hooks/
│   ├── useCompass.ts
│   ├── useLocation.ts
│   └── useSubscription.ts
├── navigation/
├── types/
└── utils/
```

---

## 🧮 九星気学 計算ロジック（最重要）

### 本命星の計算

```typescript
/**
 * 本命星を計算する
 * @param birthDate 生年月日
 * @returns 1〜9 の本命星番号（1=一白水星, 2=二黒土星, ..., 9=九紫火星）
 */
function calculateHonmeiSei(birthDate: Date): number {
  const year = birthDate.getFullYear();
  const month = birthDate.getMonth() + 1;
  const day = birthDate.getDate();
  
  // 立春（2/4頃）前生まれは前年扱い
  const effectiveYear = 
    (month < 2) || (month === 2 && day < 4) 
      ? year - 1 
      : year;
  
  const last2 = effectiveYear % 100;
  let sum = Math.floor(last2 / 10) + (last2 % 10);
  while (sum >= 10) {
    sum = Math.floor(sum / 10) + (sum % 10);
  }
  let star = 11 - sum;
  if (star <= 0) star += 9;
  return star;
}

// テストケース
// 1983/07/07 → 9（九紫火星）✅
// 1990/12/01 → 2（二黒土星）
// 1985/01/15 → 2（前年1984扱い）
```

### 九星一覧（定数ファイル）

```typescript
export const NINE_STARS = [
  { id: 1, name: '一白水星', kana: 'いっぱくすいせい', gogyou: '水', direction: '北', palace: '坎宮' },
  { id: 2, name: '二黒土星', kana: 'じこくどせい', gogyou: '土', direction: '南西', palace: '坤宮' },
  { id: 3, name: '三碧木星', kana: 'さんぺきもくせい', gogyou: '木', direction: '東', palace: '震宮' },
  { id: 4, name: '四緑木星', kana: 'しろくもくせい', gogyou: '木', direction: '南東', palace: '巽宮' },
  { id: 5, name: '五黄土星', kana: 'ごおうどせい', gogyou: '土', direction: '中央', palace: '中宮' },
  { id: 6, name: '六白金星', kana: 'ろっぱくきんせい', gogyou: '金', direction: '北西', palace: '乾宮' },
  { id: 7, name: '七赤金星', kana: 'しちせききんせい', gogyou: '金', direction: '西', palace: '兌宮' },
  { id: 8, name: '八白土星', kana: 'はっぱくどせい', gogyou: '土', direction: '北東', palace: '艮宮' },
  { id: 9, name: '九紫火星', kana: 'きゅうしかせい', gogyou: '火', direction: '南', palace: '離宮' },
] as const;

export const HAKKE = [
  { id: 'kan', name: '坎', direction: '北', gogyou: '水' },
  { id: 'gon', name: '艮', direction: '北東', gogyou: '土', note: '鬼門' },
  { id: 'shin', name: '震', direction: '東', gogyou: '木' },
  { id: 'son', name: '巽', direction: '南東', gogyou: '木' },
  { id: 'ri', name: '離', direction: '南', gogyou: '火' },
  { id: 'kon', name: '坤', direction: '南西', gogyou: '土', note: '裏鬼門' },
  { id: 'da', name: '兌', direction: '西', gogyou: '金' },
  { id: 'ken', name: '乾', direction: '北西', gogyou: '金' },
] as const;

export const ZODIAC_12 = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'] as const;
```

### 年盤計算

```typescript
/**
 * その年の中宮の九星を計算
 * @param year 西暦
 * @returns 1〜9
 */
function calculateYearBan(year: number): number {
  const baseYear = 2025;
  const baseStar = 4; // 2025年は四緑中宮
  const diff = year - baseYear;
  let star = baseStar - diff;
  while (star < 1) star += 9;
  while (star > 9) star -= 9;
  return star;
}
```

**月盤・日盤**は節気ベースで計算。実装は少し複雑なので、実装時にさとき（依頼者）にテーブルを渡してもらうか、既存ライブラリ（japanese-holidays-js等）を利用検討。

### 吉凶方位の判定

```typescript
interface BanPositions {
  chuguStar: number;
  positions: {
    '北': number, '北東': number, '東': number, '南東': number,
    '南': number, '南西': number, '西': number, '北西': number,
  };
}

/**
 * 個人の吉方位を判定
 */
function getLuckyDirections(
  honmeiSei: number,
  dayBan: BanPositions
): string[] {
  // 五行の相生関係で判定
  // 本命星を生じる五行 + 本命星と同じ五行が吉
  const myGogyou = NINE_STARS[honmeiSei - 1].gogyou;
  const compatibleGogyou = getCompatibleGogyou(myGogyou);
  
  const luckyDirs: string[] = [];
  Object.entries(dayBan.positions).forEach(([dir, starId]) => {
    const starGogyou = NINE_STARS[starId - 1].gogyou;
    if (compatibleGogyou.includes(starGogyou)) {
      luckyDirs.push(dir);
    }
  });
  
  return luckyDirs;
}

/**
 * 共通の凶方位
 */
function getCommonBadDirections(dayBan: BanPositions, year: number, month: number, day: number): {
  goouSatsu: string; // 五黄殺
  ankenSatsu: string; // 暗剣殺
  saiha: string; // 歳破
  gappa: string; // 月破
  nippa: string; // 日破
} {
  // 実装
}
```

---

## 🧭 コンパス実装

```typescript
import { Magnetometer } from 'expo-sensors';
import { useSharedValue, withTiming } from 'react-native-reanimated';

export function useCompass() {
  const heading = useSharedValue(0);
  
  useEffect(() => {
    Magnetometer.setUpdateInterval(100);
    const subscription = Magnetometer.addListener(data => {
      const angle = Math.atan2(data.y, data.x) * (180 / Math.PI);
      const normalizedAngle = (angle + 360) % 360;
      heading.value = withTiming(normalizedAngle, { duration: 300 });
    });
    
    return () => subscription.remove();
  }, []);
  
  return heading;
}
```

### 初回に位置情報・センサー許可を取得

```typescript
// オンボーディング最後に
await Location.requestForegroundPermissionsAsync();
// iOS 13+ の DeviceOrientationEvent 許可（ブラウザの場合）
```

---

## 🎨 デザイン指定

### カラーパレット（constants/colors.ts）

```typescript
export const COLORS = {
  bgPrimary: '#1A0B2E',       // ディープパープル
  bgSecondary: '#251649',     // ミッドナイトブルー
  gold: '#D4AF37',            // 吉・アクセント
  ruby: '#C41E3A',            // 凶
  pinkRed: '#E85A7A',         // 鬼門警告
  lavender: '#B794F4',        // 神秘系
  textPrimary: '#F5F5F5',     // オフホワイト
  textSecondary: '#C4B5DF',   // ライトパープル
};
```

### フォント

```typescript
// app.json の expo-font プラグインで
[
  { "src": "./assets/fonts/NotoSerifJP-Regular.otf", "fontFamily": "NotoSerifJP" },
  { "src": "./assets/fonts/NotoSerifJP-Medium.otf", "fontFamily": "NotoSerifJP-Medium" },
  { "src": "./assets/fonts/ShipporiMincho-Bold.otf", "fontFamily": "Shippori-Bold" },
  { "src": "./assets/fonts/NotoSansJP-Regular.otf", "fontFamily": "NotoSansJP" }
]
```

---

## 📐 八卦方位盤の SVG 実装ガイド

参考：Claude.ai で作ったプロトタイプのSVGを元にする（別途渡す）

### 構造
```
<Svg viewBox="0 0 300 300">
  {/* 外周の金縁八角形 */}
  <Polygon points="..." stroke="#D4AF37" />
  
  {/* 8方位の吉凶色分けセグメント */}
  {directions.map(dir => (
    <Polygon fill={getColor(dir.kikyo)} opacity={0.3} />
  ))}
  
  {/* 八卦ラベル（乾・坎・艮・震・巽・離・坤・兌） */}
  {/* 十二支ラベル（子〜亥） */}
  
  {/* 鬼門・裏鬼門マーカー */}
  
  {/* 中央 3x3 九星盤 */}
  
  {/* 回転するコンパス針（Animated.G で回転） */}
</Svg>
```

---

## 💳 サブスク実装（RevenueCat）

```typescript
import Purchases from 'react-native-purchases';

// 初期化（App.tsx）
Purchases.configure({ apiKey: 'xxx' });

// 購入
async function purchasePremium() {
  const offerings = await Purchases.getOfferings();
  const premium = offerings.current?.availablePackages[0];
  if (premium) {
    await Purchases.purchasePackage(premium);
  }
}

// ステータス確認
async function checkSubscription() {
  const info = await Purchases.getCustomerInfo();
  return info.entitlements.active['premium'] !== undefined;
}
```

---

## 🤖 Claude API 連携

```typescript
// Cloud Functions 経由で呼ぶ
export const generateDailyFortune = functions.https.onCall(async (data, context) => {
  const { honmeiSei, date, scores, luckyDirection } = data;
  
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 200,
      messages: [{
        role: 'user',
        content: `本命星「${getStarName(honmeiSei)}」の${date}の運勢を、スピリチュアルで温かみのある100字以内の文章で教えてください。総合運は${scores.total}点、吉方位は${luckyDirection}です。`
      }]
    })
  });
  
  return await response.json();
});
```

---

## 📝 開発順序の提案

1. **プロジェクト初期化**（Expo + Firebase）
2. **計算ロジック**（九星気学の core）のテスト
3. **オンボーディング画面**
4. **ホーム画面（今日の運勢）**
5. **八卦方位盤コンポーネント**（静的）
6. **コンパス連動**
7. **吉スポット検索**
8. **本命星診断画面**
9. **サブスク**
10. **プッシュ通知**
11. **テスト・デバッグ**
12. **ストア申請**

---

## 🎁 Claude.ai で作成済みのアセット

以下はClaude.ai側で既に作成済み。コードくんはこれを参考に実装：

- **仕様書**：`spec.md`（本リポジトリに含まれる）
- **プロトタイプUI**：Claude.aiのチャット内に3画面のSVG/HTMLプロトタイプあり（スクリーンショット渡せる）
- **八卦方位盤の完全版SVG**：Claude.aiのチャット内にあり（コピペ可能）

---

## 🚀 リリース目標

- α版完成：2026年5月中旬
- β版完成：2026年5月下旬
- ストア申請：2026年6月上旬
- 正式リリース：2026年6月中旬
- Netflix細木数子ドラマ公開：2026年7月 ← **このタイミングに絶対合わせる**

---

## 🙏 最後に

さときは宅建士＋インディー開発者。TAS Studioで複数プロダクトを並走してる。
**仕様書にない機能は勝手に追加しない**、**迷ったら聞く**、これだけ守ってくれたら信頼できる。

質問・不明点があれば遠慮なく聞いて。段階的にコミットしながら進めよう！

---

**以上**
