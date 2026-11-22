// Pulls every feed in feeds.mjs plus market quotes and writes data/news.json.
// Runs in GitHub Actions on a schedule. Usage: node scripts/fetch-news.mjs [--local dir]
import { XMLParser } from 'fast-xml-parser';
import { writeFile, readFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { SECTIONS, TICKERS, BREAKING_SECTIONS, BREAKING_STRONG, BREAKING_WEAK, BREAKING_HARD, BREAKING_EXCLUDE } from './feeds.mjs';

const UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';
const PER_SECTION = 60;
const MAX_AGE_H = 72;
const LOCAL = process.argv.includes('--local') ? process.argv[process.argv.indexOf('--local') + 1] : null;

const parser = new XMLParser({ processEntities: false, htmlEntities: false, ignoreAttributes: false, attributeNamePrefix: '@', textNodeName: '#text', cdataPropName: false });

async function get(url, ms = 12000) {
  if (LOCAL) return readFile(`${LOCAL}/${createHash('sha1').update(url).digest('hex')}.xml`, 'utf8');
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), ms);
  try {
    const r = await fetch(url, { headers: { 'User-Agent': UA, Accept: '*/*' }, signal: ctl.signal, redirect: 'follow' });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return await r.text();
  } finally { clearTimeout(t); }
}

const arr = (x) => (x == null ? [] : Array.isArray(x) ? x : [x]);
const txt = (x) => (x == null ? '' : typeof x === 'object' ? (x['#text'] ?? '') : String(x));
const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', '#39': "'", hellip: '…', mdash: '—', ndash: '–', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“' };
const decode = (s) => s.replace(/&(#x?[0-9a-f]+|\w+);/gi, (m, e) => {
  if (e[0] === '#') { const n = e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10); return Number.isFinite(n) ? String.fromCodePoint(n) : m; }
  return ENT[e.toLowerCase()] ?? m;
});
const clean = (s) => decode(decode(String(s || '')).replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();

function pickImage(it) {
  const cands = [];
  for (const m of arr(it['media:content'])) {
    if (m?.['@url'] && (!m['@medium'] || m['@medium'] === 'image') && !/\.(mp4|mp3|m3u8)/i.test(m['@url'])) cands.push(m['@url']);
    for (const t of arr(m?.['media:thumbnail'])) if (t?.['@url']) cands.push(t['@url']);
  }
  for (const g of arr(it['media:group'])) for (const m of arr(g?.['media:content'])) if (m?.['@url']) cands.push(m['@url']);
  for (const t of arr(it['media:thumbnail'])) if (t?.['@url']) cands.push(t['@url']);
  for (const e of arr(it.enclosure)) if (e?.['@url'] && /image/i.test(e['@type'] || 'image')) cands.push(e['@url']);
  const html = txt(it['content:encoded']) + txt(it.content) + txt(it.description) + txt(it.summary);
  const m = decode(html).match(/<img[^>]+src=["']([^"']+)["']/i);
  if (m) cands.push(m[1]);
  const ok = cands.find((u) => /^https?:\/\//.test(u) && !/(pixel|feedburner|1x1|spacer|gravatar)/i.test(u));
  return ok ? decode(ok) : null;
}

function parseFeed(xml, feed, section) {
  const doc = parser.parse(xml);
  const items = doc?.rss?.channel?.item ?? doc?.feed?.entry ?? doc?.['rdf:RDF']?.item ?? [];
  return arr(items).map((it) => {
    let link = txt(it.link);
    if (!link && it.link) link = arr(it.link).find((l) => !l['@rel'] || l['@rel'] === 'alternate')?.['@href'] || '';
    let title = clean(txt(it.title));
    let source = feed.name;
    // Google News titles end with " - Publisher"; use the real publisher.
    if (feed.fallback) {
      const s = txt(it.source);
      if (s) { source = clean(s); title = title.replace(new RegExp(`\\s+-\\s+${source.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`), ''); }
    }
    const date = new Date(txt(it.pubDate) || txt(it.published) || txt(it.updated) || txt(it['dc:date']) || Date.now());
    const summary = clean(txt(it.description) || txt(it.summary) || txt(it.content) || txt(it['content:encoded'])).slice(0, 280);
    return {
      title, link: decode(link.trim()), source, section,
      time: isNaN(date) ? Date.now() : date.getTime(),
      summary: feed.fallback ? '' : summary,
      image: pickImage(it),
      fallback: !!feed.fallback,
    };
  }).filter((a) => a.title && a.link);
}

const key = (t) => t.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(' ').filter((w) => w.length > 2).slice(0, 8).join(' ');

function isBreaking(a) {
  if (!BREAKING_SECTIONS.includes(a.section) || Date.now() - a.time > 4 * 3600e3) return false;
  const t = ` ${a.title.toLowerCase()} `;
  const has = (w) => new RegExp(`\\b${w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`).test(t);
  if (BREAKING_EXCLUDE.some(has)) return false;
  if (BREAKING_STRONG.some(has)) return true;
  return BREAKING_WEAK.some(has) && BREAKING_HARD.some(has);
}

async function ogImage(url) {
  try {
    const html = (await get(url, 6000)).slice(0, 200000);
    const m = html.match(/<meta[^>]+(?:property|name)=["'](?:og:image|twitter:image)["'][^>]+content=["']([^"']+)["']/i)
      || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["'](?:og:image|twitter:image)["']/i);
    return m ? decode(m[1]) : null;
  } catch { return null; }
}

async function pool(items, n, fn) {
  let i = 0;
  await Promise.all(Array.from({ length: n }, async () => { while (i < items.length) { const k = i++; await fn(items[k]); } }));
}

const quoteErrors = [];
const num = (v) => (v == null || v === '' ? NaN : parseFloat(String(v).replace(/[,%+]/g, '')));
async function quotes() {
  const out = new Map();
  // CNBC quote service: one request for everything.
  try {
    const syms = TICKERS.flatMap((t) => arr(t.cnbc)).join('|');
    const j = JSON.parse(await get(`https://quote.cnbc.com/quote-html-webservice/restQuote/symbolType/symbol?symbols=${encodeURIComponent(syms)}&requestMethod=itv&noform=1&partnerId=2&fund=1&exthrs=1&output=json&events=1`));
    const got = arr(j?.FormattedQuoteResult?.FormattedQuote);
    for (const q of got) {
      const t = TICKERS.find((x) => arr(x.cnbc).includes(q.symbol));
      if (!t || out.has(t.sym)) continue;
      const price = num(q.last), change = num(q.change), prevClose = num(q.previous_day_closing);
      let pct = num(q.change_pct);
      if (!Number.isFinite(pct) && Number.isFinite(change) && price !== change) pct = (change / (price - change)) * 100;
      if (!Number.isFinite(pct) && Number.isFinite(prevClose) && prevClose) pct = ((price - prevClose) / prevClose) * 100;
      if (!Number.isFinite(pct) && /^unch/i.test(String(q.change ?? ''))) pct = 0;
      if (Number.isFinite(price) && Number.isFinite(pct)) out.set(t.sym, { ...t, price, change: Number.isFinite(change) ? change : 0, pct });
      else quoteErrors.push(`quote ${q.symbol} fields: ${JSON.stringify({ last: q.last, change: q.change, change_pct: q.change_pct, prev: q.previous_day_closing })}`);
    }
  } catch (e) { quoteErrors.push(`quote CNBC: ${e.message}`); }
  // Stooq backup (free CSV) for futures, then Yahoo for anything still missing.
  const STOOQ = { 'CL=F': 'cl.f', 'GC=F': 'gc.f' };
  for (const t of TICKERS.filter((x) => !out.has(x.sym) && STOOQ[x.sym])) {
    try {
      const csv = (await get(`https://stooq.com/q/d/l/?s=${STOOQ[t.sym]}&i=d`)).trim().split('\n');
      const last = csv.at(-1).split(','), prev = csv.at(-2).split(',');
      const price = num(last[4]), pc = num(prev[4]);
      if (Number.isFinite(price) && Number.isFinite(pc)) out.set(t.sym, { ...t, price, change: price - pc, pct: ((price - pc) / pc) * 100 });
    } catch (e) { quoteErrors.push(`quote stooq ${t.sym}: ${e.message}`); }
  }
  // Yahoo backup for anything CNBC missed.
  for (const t of TICKERS.filter((x) => !out.has(x.sym))) {
    try {
      const j = JSON.parse(await get(`https://query2.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(t.sym)}?range=1d&interval=1d`));
      const m = j.chart.result[0].meta;
      const price = m.regularMarketPrice, prev = m.chartPreviousClose ?? m.previousClose;
      if (price != null && prev != null) out.set(t.sym, { ...t, price, change: price - prev, pct: ((price - prev) / prev) * 100 });
    } catch (e) { quoteErrors.push(`quote ${t.sym}: ${e.message}`); }
  }
  return TICKERS.map((t) => out.get(t.sym)).filter(Boolean).map(({ cnbc, ...q }) => q);
}

async function main() {
  const report = [];
  const sections = {};
  for (const [id, sec] of Object.entries(SECTIONS)) {
    const all = [];
    await pool(sec.feeds, 5, async (f) => {
      try {
        const items = parseFeed(await get(f.url), f, id);
        all.push(...items);
        report.push(`${id.padEnd(9)} ${String(items.length).padStart(3)}  ${f.name}`);
      } catch (e) { report.push(`${id.padEnd(9)}   ✗  ${f.name}: ${e.message}`); }
    });
    const cutoff = Date.now() - MAX_AGE_H * 3600e3;
    // Direct feeds beat Google News duplicates. Google News only tops up thin sections.
    all.sort((a, b) => (a.fallback - b.fallback) || (b.time - a.time));
    const directCount = all.filter((a) => !a.fallback && a.time >= Date.now() - MAX_AGE_H * 3600e3).length;
    const fallbackRoom = Math.max(0, 30 - directCount);
    let fallbackUsed = 0;
    const seen = new Set();
    const list = [];
    for (const a of all) {
      if (a.time < cutoff || a.time > Date.now() + 3600e3) continue;
      const k = key(a.title);
      if (!k || seen.has(k)) continue;
      if (a.fallback && fallbackUsed >= fallbackRoom) continue;
      if (a.fallback) fallbackUsed++;
      seen.add(k);
      list.push(a);
    }
    list.sort((a, b) => b.time - a.time);
    // Keep source variety: cap any one outlet at 40% of the section.
    const cap = Math.ceil(PER_SECTION * 0.4), count = {};
    sections[id] = list.filter((a) => (count[a.source] = (count[a.source] || 0) + 1) <= cap).slice(0, PER_SECTION);
  }

  // Fill missing images from the article page (top stories only; skip Google News redirect links).
  const needs = Object.values(sections).flatMap((l) => l.slice(0, 20)).filter((a) => !a.image && !a.fallback);
  if (!LOCAL) await pool(needs, 8, async (a) => { a.image = await ogImage(a.link); });

  for (const l of Object.values(sections)) for (const a of l) { a.breaking = isBreaking(a); delete a.fallback; }

  const data = {
    updated: Date.now(),
    sections: Object.fromEntries(Object.entries(SECTIONS).map(([id, s]) => [id, s.label])),
    markets: LOCAL ? [] : await quotes(),
    articles: sections,
  };
  await mkdir('data', { recursive: true });
  await writeFile('data/news.json', JSON.stringify(data));
  const rep = [...report.sort(), ...quoteErrors].join('\n');
  await writeFile('data/report.txt', `${new Date().toISOString()}\n${rep}\n`);
  console.log(rep);
  console.log(`\nwrote data/news.json — ${Object.values(sections).reduce((n, l) => n + l.length, 0)} stories, ${data.markets.length} quotes`);
}

main().catch((e) => { console.error(e); process.exit(1); });
