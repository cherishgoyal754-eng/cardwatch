import crypto from 'node:crypto';

const ADMIN_KEY_SALT = 'cardwatch_sovereign_vault_v1::';
const FALLBACK_ADMIN_HASH =
  '2ba60fdfa8cc5c14ed10502f6ea5ea784ddb0598ef2e4085c20e98463b198397';

const RSS_QUERIES = [
  'credit+card+devaluation+India+when:14d',
  '(HDFC+OR+ICICI+OR+SBI+OR+Axis+OR+Amex)+credit+card+rules+revision+when:14d',
];

function verifyKeyHeader(rawKey: string | null): boolean {
  if (!rawKey || !rawKey.trim()) return false;
  const expectedHex = (
    process.env.CARDWATCH_ADMIN_KEY_HASH ||
    process.env.VITE_ADMIN_KEY_HASH ||
    FALLBACK_ADMIN_HASH
  )
    .trim()
    .toLowerCase();

  const candidateHex = crypto
    .createHash('sha256')
    .update(`${ADMIN_KEY_SALT}${rawKey.trim()}`)
    .digest('hex');

  if (candidateHex.length !== expectedHex.length) return false;
  return crypto.timingSafeEqual(
    Buffer.from(candidateHex, 'hex'),
    Buffer.from(expectedHex, 'hex')
  );
}

function parseRssXml(xmlText: string) {
  const items: Array<{
    title: string;
    link: string;
    pubDate: string;
    source: string;
    description: string;
  }> = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match: RegExpExecArray | null;

  while ((match = itemRegex.exec(xmlText)) !== null) {
    const content = match[1];
    const titleMatch = /<title>(.*?)<\/title>/s.exec(content);
    const linkMatch = /<link>(.*?)<\/link>/s.exec(content);
    const pubDateMatch = /<pubDate>(.*?)<\/pubDate>/s.exec(content);
    const sourceMatch = /<source[^>]*>(.*?)<\/source>/s.exec(content);
    const descMatch = /<description>([\s\S]*?)<\/description>/s.exec(content);

    const title = titleMatch
      ? titleMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').trim()
      : '';
    if (!title) continue;

    items.push({
      title,
      link: linkMatch ? linkMatch[1].trim() : '',
      pubDate: pubDateMatch ? pubDateMatch[1].trim() : '',
      source: sourceMatch ? sourceMatch[1].trim() : 'Google News',
      description: descMatch
        ? descMatch[1].replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim()
        : '',
    });
  }
  return items;
}

export async function POST(request: Request): Promise<Response> {
  const adminKeyHeader = request.headers.get('x-admin-key');
  if (!verifyKeyHeader(adminKeyHeader)) {
    return Response.json(
      { ok: false, error: 'Unauthorized: Invalid or missing Saved Master Admin Key.' },
      { status: 401 }
    );
  }

  try {
    const allArticles: ReturnType<typeof parseRssXml> = [];
    const seen = new Set<string>();

    for (const q of RSS_QUERIES) {
      const url = `https://news.google.com/rss/search?q=${q}&hl=en-IN&gl=IN&ceid=IN:en`;
      const res = await fetch(url, {
        headers: { 'User-Agent': 'CardWatchAdminRadar/1.0' },
      });
      if (!res.ok) continue;
      const xml = await res.text();
      for (const item of parseRssXml(xml)) {
        const key = item.title.toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          allArticles.push(item);
        }
      }
    }

    const geminiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (!geminiKey || allArticles.length === 0) {
      return Response.json({
        ok: true,
        rawArticlesCount: allArticles.length,
        articles: allArticles.slice(0, 10),
        circulars: [],
        note: geminiKey
          ? 'No new articles returned from Google News.'
          : 'Gemini API key unavailable on server; returning raw headlines.',
      });
    }

    const prompt = `Analyze these Indian credit card news articles from Google News and extract ONLY genuine bank credit card circulars, fee hikes, lounge cutoffs, or reward devaluations.
Articles:
${JSON.stringify(allArticles.slice(0, 12), null, 2)}

Return ONLY a valid JSON array with items matching:
[{
  "cardId": "matching card id (e.g. hdfc-regalia-gold, sbi-cashback, icici-sapphiro, axis-magnus) or general-banking",
  "cardName": "Card Name or Bank Card Portfolio",
  "bank": "Bank Name",
  "date": "MMM DD, YYYY",
  "announcedDate": "MMM DD, YYYY",
  "deadline": "MMM DD, YYYY",
  "type": "devaluation" | "regulatory_update" | "enhancement",
  "title": "Concise circular headline",
  "summary": "2-sentence factual summary",
  "oldValue": "Previous policy",
  "newValue": "New enforced rule",
  "officialRef": "Source publisher or circular name",
  "severity": "critical" | "high" | "medium" | "low" | "positive"
}]`;

    const models = ['gemini-3.1-flash-lite', 'gemini-flash-lite-latest'];
    let circulars: unknown[] = [];

    for (const model of models) {
      try {
        const gRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                temperature: 0.1,
                responseMimeType: 'application/json',
              },
            }),
          }
        );
        if (!gRes.ok) continue;
        const gJson = await gRes.json();
        const text = gJson?.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
        const parsed = JSON.parse(text.trim());
        if (Array.isArray(parsed)) {
          circulars = parsed;
          break;
        }
      } catch (err) {
        console.error(`Radar sync Gemini parse error (${model}):`, err);
      }
    }

    return Response.json({
      ok: true,
      syncedAt: new Date().toISOString(),
      rawArticlesCount: allArticles.length,
      articles: allArticles.slice(0, 10),
      circulars,
    });
  } catch (err: any) {
    console.error('Radar sync endpoint failure:', err);
    return Response.json(
      { ok: false, error: err?.message || 'Radar sync failed.' },
      { status: 500 }
    );
  }
}
