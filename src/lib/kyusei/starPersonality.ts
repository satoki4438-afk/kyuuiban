export interface StarPersonality {
  catchcopy: string;
  personality: string;
  strength: string;
  weakness: string;
  career: string;
}

export const STAR_PERSONALITY: Record<number, StarPersonality> = {
  1: {
    catchcopy: '深海のように静かで揺るがない魂',
    personality: '思慮深く聡明。直感力が高く、秘密を守る力がある。外見は穏やかだが内に強い意志を持つ。',
    strength: '観察力・忍耐力・適応力・人を引きつける魅力',
    weakness: '優柔不断・孤独を好みすぎる・感情を表に出しにくい',
    career: 'カウンセラー・研究者・医療・芸術家',
  },
  2: {
    catchcopy: '大地のように育て包む母なる星',
    personality: '面倒見がよく、誠実で働き者。継続力が高く、コツコツ積み上げることが得意。',
    strength: '勤勉さ・面倒見のよさ・忍耐力・実務能力',
    weakness: '心配性・執着しすぎる・頑固な面も',
    career: '教師・医療・農業・不動産・サービス業',
  },
  3: {
    catchcopy: '春雷のごとく鋭く力強い行動の星',
    personality: '行動力旺盛で、新しいことへの挑戦を好む。エネルギーに満ち、周りを巻き込む力がある。',
    strength: '行動力・創造力・リーダーシップ・社交性',
    weakness: '計画性が低い・飽きっぽい・衝動的',
    career: '起業家・エンタメ・ITエンジニア・営業',
  },
  4: {
    catchcopy: '風のように広く遠く縁を結ぶ星',
    personality: 'コミュニケーション能力が高く、人間関係が広い。信用を大切にし、人の間を取り持つ。',
    strength: '協調性・信頼性・交渉力・柔軟性',
    weakness: '優柔不断・決断が遅い・周りに流されやすい',
    career: '外交官・貿易・メディア・コンサルタント',
  },
  5: {
    catchcopy: '中心に在り、すべてを統べる王者の星',
    personality: 'カリスマ性があり、信念が強い。破壊と再生の力を持ち、試練を乗り越え大成する。',
    strength: '統率力・突破力・粘り強さ・存在感',
    weakness: '頑固・独裁的になりやすい・欲が強い',
    career: '経営者・政治家・医師・スポーツ選手',
  },
  6: {
    catchcopy: '天より降る清廉な光の星',
    personality: 'プライドが高く完璧主義。正義感が強く、リーダーとして周囲から尊敬される。',
    strength: '完璧主義・正義感・統率力・格調の高さ',
    weakness: '融通が利かない・批判的になりすぎる・孤高になりやすい',
    career: '弁護士・医師・金融・経営幹部',
  },
  7: {
    catchcopy: '宴の場に喜びをもたらす社交の星',
    personality: '明るく社交的で、楽しいことが好き。話術が巧みで人を惹きつけ、財運にも恵まれやすい。',
    strength: '社交性・話術・金銭感覚・楽観性',
    weakness: '派手好き・浪費傾向・深く考えないことがある',
    career: '芸能・接客・金融・飲食・マーケティング',
  },
  8: {
    catchcopy: '険しい山のように変革と継承を担う星',
    personality: '変化と変革を好み、大器晩成型。一度動き出すと大きな変化をもたらす力がある。',
    strength: '変革力・粘り強さ・不動の精神・財産を築く力',
    weakness: '頑固・移り気・結果が出るまで時間がかかる',
    career: '不動産・建築・政治・起業・伝統技術',
  },
  9: {
    catchcopy: '太陽のように輝き知性で世を照らす星',
    personality: '頭が良く直感力と美的センスが高い。注目を浴びることが好きで、華やかなオーラがある。',
    strength: '知性・美的センス・直感力・表現力',
    weakness: '感情的になりやすい・飽きっぽい・見栄を張る',
    career: 'デザイナー・芸術家・学者・俳優・マスコミ',
  },
};
