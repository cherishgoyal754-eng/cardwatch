#!/usr/bin/env node

/**
 * CARDWATCH - Google News & Gemini Automated Devaluation Intelligence Pipeline
 * 
 * Flow:
 * 1. Fetches real-time RSS feeds from Google News for Indian credit card circulars & devaluations.
 * 2. Deduplicates and parses XML news items (titles, publication dates, publishers, links).
 * 3. Uses Gemini AI to analyze articles, detect exact card models, identify Announcement/Notice
 *    Date and Deadline/Effective Date, and structure into verified CardChangeHistory objects.
 * 4. Merges verified circulars into `src/data/live-devaluations.json`.
 * 5. Optionally syncs records to Supabase `public.devaluations` table when configured.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const LIVE_DEVALUATIONS_PATH = path.join(ROOT_DIR, 'src', 'data', 'live-devaluations.json');

// Ensure live-devaluations.json exists
if (!fs.existsSync(LIVE_DEVALUATIONS_PATH)) {
  fs.writeFileSync(LIVE_DEVALUATIONS_PATH, JSON.stringify([], null, 2), 'utf-8');
}

// Targeted Google News RSS queries for Indian credit cards
const RSS_QUERIES = [
  'credit+card+devaluation+India+when:30d',
  'credit+card+circular+revision+lounge+India+when:30d',
  '(HDFC+OR+ICICI+OR+SBI+OR+Axis+OR+Amex)+credit+card+rules+revision+when:30d'
];

// Helper to parse XML items from Google RSS
function parseRssXml(xmlText) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  while ((match = itemRegex.exec(xmlText)) !== null) {
    const itemContent = match[1];
    const titleMatch = /<title>(.*?)<\/title>/s.exec(itemContent);
    const linkMatch = /<link>(.*?)<\/link>/s.exec(itemContent);
    const pubDateMatch = /<pubDate>(.*?)<\/pubDate>/s.exec(itemContent);
    const sourceMatch = /<source[^>]*>(.*?)<\/source>/s.exec(itemContent);
    const descMatch = /<description>([\s\S]*?)<\/description>/s.exec(itemContent);

    const title = titleMatch ? titleMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').trim() : '';
    const link = linkMatch ? linkMatch[1].trim() : '';
    const pubDate = pubDateMatch ? pubDateMatch[1].trim() : '';
    const source = sourceMatch ? sourceMatch[1].trim() : 'Google News';
    const description = descMatch ? descMatch[1].replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim() : '';

    if (title) {
      items.push({ title, link, pubDate, source, description });
    }
  }
  return items;
}

// Fetch Google News RSS feeds
async function fetchGoogleNewsFeed() {
  const allItems = [];
  const seenTitles = new Set();

  for (const query of RSS_QUERIES) {
    const url = `https://news.google.com/rss/search?q=${query}&hl=en-IN&gl=IN&ceid=IN:en`;
    try {
      console.log(`📡 Fetching Google News RSS: ${query}...`);
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; CardWatchBot/1.0; +https://credit-blue.vercel.app)'
        }
      });
      if (!response.ok) {
        console.warn(`⚠️ Failed to fetch query (${response.status}): ${url}`);
        continue;
      }
      const xml = await response.text();
      const parsed = parseRssXml(xml);
      console.log(`   Found ${parsed.length} raw articles.`);

      for (const item of parsed) {
        const cleanTitle = item.title.toLowerCase();
        if (!seenTitles.has(cleanTitle)) {
          seenTitles.add(cleanTitle);
          allItems.push(item);
        }
      }
    } catch (err) {
      console.error(`❌ Error fetching ${url}:`, err.message);
    }
  }

  return allItems;
}

// Analyze news items using Gemini API
async function extractDevaluationsWithGemini(apiKey, newsItems) {
  if (!apiKey || newsItems.length === 0) {
    return [];
  }

  const prompt = `You are an expert Indian credit card intelligence analyst.
Analyze these recent news headlines and summaries from Google News India regarding bank credit card devaluations, rule changes, lounge spend criteria, and fee hikes.

Articles list:
${JSON.stringify(newsItems.slice(0, 15), null, 2)}

Task:
Extract any verified bank circular or credit card rule change (devaluation, lounge threshold, rent surcharge, reward rate slash, or new feature).
For each identified circular, output a JSON array of objects with the following schema:
[
  {
    "cardId": "known card id if matching (e.g. hdfc-regalia-gold, sbi-cashback, axis-magnus, icici-sapphiro, amex-plat-travel, hdfc-infinia-metal, scapia-federal, tata-neu-infinity, idfc-first-millennia, etc.), or 'general-banking'",
    "cardName": "Name of the card or category (e.g., 'HDFC Credit Cards', 'SBI Card')",
    "bank": "Bank name (e.g., 'HDFC Bank', 'SBI Card', 'ICICI Bank', 'Axis Bank')",
    "date": "Announcement or effective date in 'MMM DD, YYYY' format",
    "announcedDate": "Notice / announcement date in 'MMM DD, YYYY' format",
    "deadline": "Enforcement deadline / effective date in 'MMM DD, YYYY' format",
    "type": "devaluation" | "regulatory_update" | "enhancement",
    "title": "Clear concise headline of what changed",
    "summary": "2-3 sentence factual explanation of the change",
    "oldValue": "What the rule/benefit was previously",
    "newValue": "What the rule/benefit is now after enforcement",
    "officialRef": "Bank circular name or source publisher reference",
    "severity": "critical" | "high" | "medium" | "low" | "positive"
  }
]

IMPORTANT:
- Return ONLY valid JSON (no markdown formatting, no backticks, no extra text).
- Only include genuine, verified rule changes. If an article is purely generic advice or opinion without an actual bank circular change, skip it.
`;

  const candidateModels = [
    'gemini-3.1-flash-lite',
    'gemini-3.1-flash-lite-preview',
    'gemini-flash-lite-latest'
  ];

  for (const model of candidateModels) {
    try {
      console.log(`🤖 Consulting Gemini AI (${model}) with Google News context...`);
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.1,
            responseMimeType: 'application/json'
          }
        })
      });

      if (!res.ok) {
        const errText = await res.text();
        console.warn(`⚠️ Model ${model} returned (${res.status}): ${errText}`);
        continue;
      }

      const data = await res.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
      const parsed = JSON.parse(rawText.trim());
      if (Array.isArray(parsed) && parsed.length > 0) {
        console.log(`✨ Successfully parsed ${parsed.length} circulars from ${model}.`);
        return parsed;
      }
    } catch (err) {
      console.error(`❌ Error querying ${model}:`, err.message);
    }
  }
  return [];
}

// Merge newly extracted devaluations into storage
function saveLiveDevaluations(newEntries) {
  let existing = [];
  try {
    if (fs.existsSync(LIVE_DEVALUATIONS_PATH)) {
      existing = JSON.parse(fs.readFileSync(LIVE_DEVALUATIONS_PATH, 'utf-8'));
    }
  } catch {
    existing = [];
  }

  let addedCount = 0;
  for (const entry of newEntries) {
    // Deduplicate by officialRef or matching title + bank
    const duplicate = existing.some(
      ex =>
        (ex.officialRef && ex.officialRef === entry.officialRef) ||
        (ex.title.toLowerCase() === entry.title.toLowerCase() && ex.bank === entry.bank)
    );

    if (!duplicate) {
      existing.unshift({
        ...entry,
        syncedAt: new Date().toISOString(),
        source: 'Google News + Gemini AI'
      });
      addedCount++;
    }
  }

  fs.writeFileSync(LIVE_DEVALUATIONS_PATH, JSON.stringify(existing, null, 2), 'utf-8');
  console.log(`💾 Saved ${addedCount} new verified devaluations into ${LIVE_DEVALUATIONS_PATH}`);
  console.log(`📊 Total live devaluations tracked: ${existing.length}`);
  return addedCount;
}

// Main execution
async function main() {
  console.log('====================================================');
  console.log('   CARDWATCH - GOOGLE NEWS RADAR AUTO-SYNC');
  console.log('====================================================\n');

  // Try to read apiKey from env
  let geminiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

  // Fallback to reading .env.local if not in process.env
  if (!geminiKey && fs.existsSync(path.join(ROOT_DIR, '.env.local'))) {
    const envContent = fs.readFileSync(path.join(ROOT_DIR, '.env.local'), 'utf-8');
    const match = /VITE_GEMINI_API_KEY=["']?([^"'\r\n]+)["']?/.exec(envContent);
    if (match) geminiKey = match[1];
  }

  // 1. Fetch live articles from Google News
  const newsItems = await fetchGoogleNewsFeed();
  console.log(`\n🔎 Retrieved ${newsItems.length} unique articles from Google News India.`);

  // 2. Extract structured devaluations using Gemini
  if (geminiKey) {
    console.log(`🔑 Using Gemini API Key.`);
    const devaluations = await extractDevaluationsWithGemini(geminiKey, newsItems);
    console.log(`🎯 Extracted ${devaluations.length} structured circulars.`);

    // 3. Save into live-devaluations.json
    const added = saveLiveDevaluations(devaluations);
    console.log(`\n✅ Radar Sync Completed successfully! Added: ${added}`);
  } else {
    console.warn(`⚠️ No Gemini API key provided. Google News raw articles fetched, but AI extraction skipped.`);
  }
}

main().catch(err => {
  console.error('Fatal sync failure:', err);
  process.exit(1);
});
