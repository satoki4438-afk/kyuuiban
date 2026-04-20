# 九星気学 × 風水アプリ 仕様書【完全版】

**プロジェクトコード名**: 九気盤（きゅうきばん）
**作成日**: 2026年4月19日
**作成者**: TAS Studio（さとき）
**バージョン**: v1.0 (MVP仕様・完全版)

---

## 1. コンセプト

### 1.1 一言で言うと

**「九星気学 × 風水 × コンパスで、今この瞬間の運気を可視化する本格占術アプリ」**

### 1.2 差別化ポイント

1. **八卦方位盤ビジュアル**：八角形・八卦・十二支・鬼門裏鬼門を含む本格派デザイン
2. **方位盤×コンパス同期**：スマホの向きと盤が連動
3. **吉スポット検索**：占い結果から即アクションに繋げる導線（最大の差別化）
4. **スピ×本格派のデザイン**：パープル基調、宇宙感、明朝体、金色アクセント
5. **エビデンス重視**：数千年の歴史を持つ九星気学がベース

### 1.3 タイミング戦略

**2026年7月 Netflix細木数子ドラマ公開** → 占いブーム再燃予想。このタイミングに合わせてリリース。

---

## 2. ターゲット

**プライマリ**：25〜45歳の女性、占い・スピ好き、開運関心層
**セカンダリ**：引越し・転職で方位を気にする層、風水インテリア関心層、細木数子ドラマからの流入層

---

## 3. 技術スタック

### 3.1 フロントエンド
- **React Native** (Expo SDK 最新)
- TypeScript
- React Navigation
- React Native Reanimated 3（盤のアニメーション）
- React Native SVG（八卦盤・九星盤の描画）
- expo-sensors（`Magnetometer` でコンパス）
- expo-location（現在地・吉スポット検索用）

### 3.2 バックエンド
- **Firebase**
  - Authentication（匿名ログイン＋メール）
  - Firestore（ユーザーデータ・鑑定履歴）
  - Cloud Functions（九星計算・運勢生成）
  - FCM（毎朝7時のプッシュ通知）

### 3.3 決済
- **RevenueCat**（App Store / Google Play サブスク管理）

### 3.4 AI
- **Claude API**（Haiku 4.5 でコスト抑制）
- 運勢メッセージ・風水アドバイスの自然文生成
- 日次メッセージは Firestore にキャッシュ

### 3.5 外部API
- **Google Places API**（吉スポット検索）
- **Google Maps API**（ナビ連携）

### 3.6 デプロイ
- EAS Build
- App Store / Google Play

---

## 4. 画面構成（MVP）

### 4.1 ナビゲーション構造

```
[スプラッシュ]
  ↓
[オンボーディング]（初回のみ）
  ├─ Step1: ウェルカム
  ├─ Step2: 生年月日入力
  ├─ Step3: 性別選択
  ├─ Step4: 名前
  └─ Step5: 通知許可
  ↓
[メインタブ]
  ├─ タブ1: 今日（今日の運勢）【無料】
  ├─ タブ2: 方位（八卦方位盤×コンパス）【課金】
  ├─ タブ3: 宿命（本命星診断）【課金】
  └─ タブ4: 設定
```

### 4.2 タブ1: 今日の運勢【無料】

**表示要素（上から下に）**

1. ヘッダー：日付・旧暦・節気
2. 総合運スコア（0〜100、毛筆体・金色で大きく）
3. 4項目バー：恋愛運・金運・仕事運・健康運
4. ラッキー情報：カラー・アイテム・吉方位（1つのみ）
5. 今日のお告げメッセージ（AI生成・100字程度、明朝体）
6. ミニ八卦盤（タップで方位タブへ遷移）

### 4.3 タブ2: 方位（八卦方位盤×コンパス）【課金】

**コア画面・最大の差別化ポイント**

**表示要素**

1. **モード切り替え**：[年盤] [月盤] [日盤] [時盤]
2. **八卦方位盤（SVG）**
   - 外周：八角形の金縁
   - 第1リング：八卦（乾・坎・艮・震・巽・離・坤・兌）
   - 第2リング：十二支（子〜亥）
   - 第3リング：九星の現在配置
   - 鬼門マーカー（北東・赤枠）
   - 裏鬼門マーカー（南西・赤枠）
   - 中央：3×3の九星盤
   - コンパス針：金色、スマホの向きに連動
3. **各方位の色分け**
   - 吉：金色 #D4AF37
   - 凶：赤 #C41E3A
   - 鬼門・裏鬼門：ピンクレッド #E85A7A
   - 普通：ラベンダー #B794F4
4. 凡例（Legend）
5. 情報カード：今向いている方位・本日の吉方・避けるべき方位
6. **CTA：「この方向の吉スポットを探す」**

**技術実装ポイント**

```typescript
import { Magnetometer } from 'expo-sensors';

Magnetometer.addListener(data => {
  const heading = calculateHeading(data);
  rotateValue.value = withTiming(-heading, { duration: 300 });
});
```

UIは現代式（上が北）で表示。ただし盤の配置は九星気学の伝統に従う。

### 4.4 吉スポット検索画面【課金】

**表示要素**

1. **日付切り替えタブ**（重要）
   - [今日] [明日] [今週末] [カスタム]
   - 「明日どこ行こう？」「週末の予定どうしよ？」に対応
   - 選択日の吉方位を計算して表示
2. 現在の吉方位表示
3. **距離帯選択**
   - [徒歩(〜2km)] [近(〜10km)] [中(〜50km)] [遠(50km〜)]
   - デフォルトは選択日が「今日」なら近距離、「明日・週末」なら中〜長距離
4. スポットリスト（カテゴリ別タブ）
   - [神社・寺] [カフェ] [公園] [パワースポット] [温泉] [観光地]
   - 距離順、各カード：写真・名前・距離・方角・評価
5. 地図表示切り替えボタン
6. Google Maps ナビボタン

**ユースケース例**

- 「今日のランチどこ行こう？」→ 徒歩・カフェ
- 「明日の散歩コース」→ 近距離・公園
- 「週末どこ出かけよう？」→ 中〜長距離・観光地
- 「来週の旅行先どこ行こう？」→ 長距離・温泉

**ロジック**

```typescript
type DistanceRange = 'walk' | 'near' | 'mid' | 'far';

const DISTANCE_CONFIG = {
  walk: { min: 0, max: 2000 },      // 徒歩圏（0〜2km）
  near: { min: 0, max: 10000 },     // 近距離（〜10km）
  mid:  { min: 0, max: 50000 },     // 中距離（〜50km）
  far:  { min: 50000, max: 300000 } // 長距離（旅行）
};

async function findLuckySpots(
  currentLocation: LatLng,
  luckyDirections: Direction[],
  category: Category,
  range: DistanceRange = 'near'  // デフォルトは近距離
) {
  const { max } = DISTANCE_CONFIG[range];
  const angleRanges = luckyDirections.map(dir => getAngleRange(dir));
  const spots = await googlePlacesAPI.searchNearby({
    location: currentLocation,
    radius: max,
    type: category,
  });
  return spots.filter(spot => {
    const bearing = calculateBearing(currentLocation, spot.location);
    return angleRanges.some(range => isInRange(bearing, range));
  });
}
```

### 4.5 タブ3: 宿命（本命星診断）【課金】

1. 本命星カード（毛筆体・大きく・キャッチコピー）
2. 基本情報：月命星・五行・定位・最大吉方
3. 性格・強み・弱み・適職（AI生成）
4. 2026年の年運
5. 今月の運勢詳細
6. 相性診断ボタン（将来拡張）

### 4.6 タブ4: 設定

プロフィール・通知・サブスク管理・利用規約・お問い合わせ・バージョン情報

---

## 5. マネタイズ

### 5.1 課金モデル

**完全サブスク型（1プラン）**

- **無料**：今日の運勢（タブ1）のみ
- **課金**：八卦方位盤・吉スポット検索・本命星詳細・月間年間運勢・広告非表示

### 5.2 価格

| プラン | 価格 | 期間 |
|---|---|---|
| プレミアム | ¥480 | 月額 |

- 年額プランは後日検討（¥4,800 / 年）
- 初回3〜7日の無料トライアル導入検討

### 5.3 補助マネタイズ

- アフィリエイト：神社グッズ・パワーストーン・風水グッズ（Amazon Associates）
- 引越し業者紹介（宅建知見活用）
- 吉方位への旅行プラン（じゃらん・楽天トラベル）

---

## 6. 九星気学 計算ロジック【核心】

### 6.1 3レイヤー構造

```
【レイヤー1】八卦方位盤（後天定位盤）＝固定の地図
  全員・全時代共通。北=坎、南=離、東=震... が永遠に固定。
  
【レイヤー2】九星盤（年盤・月盤・日盤・時盤）＝動くデータ
  時間で変化。中宮に入る星が年月日時で変わる。
  
【レイヤー3】本命星＝個人識別
  生年月日で決まる。一生変わらない。

3つを重ねて → その人の今の吉凶判定
```

### 6.2 本命星の計算

**ルール**

1. 生年（西暦）の下2桁を分解して足す
2. 10以上なら一桁になるまで足す
3. 11 から引く
4. 0以下なら +9 する
5. 立春（2月4日頃）前生まれは前年扱い

**計算例：1983年7月7日生まれ**
```
1983 → 8 + 3 = 11
11 → 1 + 1 = 2
11 - 2 = 9
→ 本命星：九紫火星
```

**コード**

```typescript
function calculateHonmeiSei(birthDate: Date): number {
  const year = birthDate.getFullYear();
  const month = birthDate.getMonth() + 1;
  const day = birthDate.getDate();
  
  // 立春前なら前年扱い
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
```

### 6.3 月命星の計算

生まれ月と年支で決まる。早見表をコード化。実装時に詳細テーブルをClaude Codeへ渡す。

### 6.4 九星一覧

| 星 | ふりがな | 五行 | 定位 | 定位宮 |
|---|---|---|---|---|
| 一白水星 | いっぱくすいせい | 水 | 北 | 坎宮 |
| 二黒土星 | じこくどせい | 土 | 南西 | 坤宮 |
| 三碧木星 | さんぺきもくせい | 木 | 東 | 震宮 |
| 四緑木星 | しろくもくせい | 木 | 南東 | 巽宮 |
| 五黄土星 | ごおうどせい | 土 | 中央 | 中宮 |
| 六白金星 | ろっぱくきんせい | 金 | 北西 | 乾宮 |
| 七赤金星 | しちせききんせい | 金 | 西 | 兌宮 |
| 八白土星 | はっぱくどせい | 土 | 北東 | 艮宮 |
| 九紫火星 | きゅうしかせい | 火 | 南 | 離宮 |

### 6.5 年盤・月盤・日盤の計算

**年盤**
```typescript
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

月盤・日盤も同様（節気ベース）。

### 6.6 吉凶方位の判定

**共通の凶方位**
- **五黄殺**：その盤で五黄土星がいる方位
- **暗剣殺**：五黄土星の反対側
- **歳破**：その年の十二支の反対方位
- **月破**：月の十二支の反対
- **日破**：日の十二支の反対

**個人の凶方位（本命星基準）**
- 本命殺：本命星がいる方位
- 本命的殺：本命星の反対側
- 月命殺：月命星がいる方位
- 月命的殺：月命星の反対側

**個人の吉方位**
- 本命星の五行を生じる五行の方位
- 本命星と同じ五行の方位

### 6.7 鬼門・裏鬼門

- **鬼門**：北東（艮宮）= 常に注意
- **裏鬼門**：南西（坤宮）= 常に注意
- 九星気学の吉凶判定とは別レイヤーで常時警告表示

---

## 7. デザイン仕様

### 7.1 コンセプト

**「神秘的スピリチュアル × 本格派」**

### 7.2 カラーパレット

| 用途 | カラー | コード |
|---|---|---|
| メイン背景 | ディープパープル | #1A0B2E |
| サブ背景 | ミッドナイトブルー | #251649 |
| アクセント1（吉） | ゴールド | #D4AF37 |
| アクセント2（凶） | ルビーレッド | #C41E3A |
| 鬼門警告 | ピンクレッド | #E85A7A |
| アクセント3（神秘） | ラベンダー | #B794F4 |
| テキスト | オフホワイト | #F5F5F5 |
| サブテキスト | ライトパープル | #C4B5DF |

### 7.3 フォント

- 日本語メイン：Noto Serif JP（明朝）
- 星名・強調：Shippori Mincho B1（筆書体系）
- 英数字：Cormorant Garamond
- UIラベル：Noto Sans JP

### 7.4 アニメーション

- 盤の回転：ease-in-out 300〜800ms
- 星屑パーティクル：常時うっすら動く
- 運気スコア：カウントアップアニメーション（800ms）

### 7.5 モチーフ

- 星屑・オーラ・月の満ち欠け
- 八卦のシンボル（背景にうっすら）
- 金色の光線エフェクト

---

## 8. データモデル（Firestore）

### 8.1 users

```typescript
{
  uid: string,
  name: string,
  birthDate: Timestamp,
  gender: 'male' | 'female' | 'other',
  birthTime?: string,
  honmeiSei: number,
  getsumeiSei: number,
  subscription: {
    status: 'free' | 'trial' | 'active' | 'canceled',
    plan: 'premium' | null,
    expiresAt: Timestamp | null,
    trialUsed: boolean
  },
  notificationSettings: {
    morningFortune: boolean,
    luckyDirection: boolean,
  },
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### 8.2 dailyBans（全ユーザー共通）

```typescript
{
  date: string,
  yearBan: {
    chuguStar: number,
    positions: Record<string, number>
  },
  monthBan: { /* 同上 */ },
  dayBan: { /* 同上 */ },
  zodiacDay: string,
  zodiacMonth: string,
  zodiacYear: string,
  kyoHoi: {
    goouSatsu: string,
    ankenSatsu: string,
    saiha: string,
    gappa: string,
    nippa: string
  },
  generatedAt: Timestamp
}
```

### 8.3 userDailyFortunes

```typescript
{
  uid: string,
  date: string,
  totalScore: number,
  scores: {
    love: number,
    money: number,
    work: number,
    health: number
  },
  luckyColor: string,
  luckyItem: string,
  message: string,
  luckyDirections: string[],
  avoidDirections: string[],
  cachedAt: Timestamp
}
```

---

## 9. 開発フェーズ

### Phase 1: MVP（約4週間）

**Week 1：基盤**
- Expo プロジェクトセットアップ
- Firebase連携
- 九星気学の計算ロジック実装
- オンボーディング画面

**Week 2：コア機能**
- 八卦方位盤 SVG 描画
- コンパス同期
- 九星盤の年/月/日/時盤切り替え
- 今日の運勢画面

**Week 3：機能拡充**
- 本命星診断画面
- 吉スポット検索（Google Places連携）
- Claude API連携
- プッシュ通知（FCM）

**Week 4：マネタイズ＆仕上げ**
- RevenueCat統合
- 課金画面
- デザイン最終調整
- バグ修正・テスト
- App Store / Google Play 申請

### Phase 2: 拡張

- 月間・年間運勢の詳細化
- 風水アドバイスの詳細化（部屋別）
- 引越し吉方位診断（不動産連携）
- 四柱推命の本格鑑定追加
- 相性診断
- AIチャット相談
- **宅建連動：吉方位の物件検索（LIFULL HOME'S / SUUMO連携）**

---

## 10. リリース目標

- 開発開始：2026年4月下旬
- α版完成：2026年5月中旬
- β版完成：2026年5月下旬
- ストア申請：2026年6月上旬
- 正式リリース：2026年6月中旬
- Netflix細木数子ドラマ公開：2026年7月 ← **ここに合わせる🔥**

---

## 11. リスク

### 11.1 法的リスク

- ❌ 「六星占術」「大殺界」は商標登録済 → 使用禁止
- ✅ 「九星気学」「風水」「鬼門」は一般名詞OK
- ✅ 「本命星」「五黄殺」「暗剣殺」は九星気学の一般用語OK
- 効果・効能の断定は避ける（「〜と言われています」表現）

### 11.2 技術的リスク

- コンパス精度：キャリブレーション機能を追加
- iOS の DeviceOrientation 許可：初回ガイド
- Google Places API コスト：キャッシュ戦略
- Claude API コスト：本命星別1日1回、キャッシュ活用

### 11.3 ビジネスリスク

- 既存占いアプリ多数 → 「八卦盤×コンパス×吉スポット検索」で差別化
- 細木数子便乗と見られないよう独立ブランドとして設計

---

## 12. KPI

### Phase 1 リリース直後
- ダウンロード：10,000（初月）
- 有料転換率：5%
- 月間解約率：20%以下
- DAU/MAU：30%以上

### Phase 2
- ダウンロード：50,000（3ヶ月）
- 有料転換率：8%
- MRR：¥1,000,000 以上

---

## 13. アプリ名

**九気盤（きゅうきばん）** ← 確定🔥

- 「九」= 九星気学
- 「気」= 気の流れ・運気
- 「盤」= 方位盤・コンパス

3つの核が一発で伝わる造語。

---

**以上**
