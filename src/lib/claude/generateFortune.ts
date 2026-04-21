const API_URL = 'https://api.anthropic.com/v1/messages';

interface FortuneParams {
  starName: string;
  gogyou: string;
  totalScore: number;
  luckyDirection: string;
  dateLabel: string;
}

export async function generateFortuneMessage(params: FortuneParams): Promise<string> {
  const apiKey = process.env.EXPO_PUBLIC_CLAUDE_API_KEY;
  if (!apiKey) throw new Error('API key missing');

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 150,
      system: 'あなたは九星気学の占い師です。スピリチュアルで温かみのある運勢メッセージを100字以内で生成してください。改行なし・体言止め不要・敬体で。',
      messages: [{
        role: 'user',
        content: `本命星「${params.starName}」（五行：${params.gogyou}）の${params.dateLabel}の運勢メッセージをお願いします。総合運${params.totalScore}点、今日の吉方位は${params.luckyDirection}です。`,
      }],
    }),
  });

  if (!res.ok) throw new Error(`Claude API error: ${res.status}`);
  const data = await res.json();
  return (data.content[0].text as string).trim();
}
