// Sends breaking-news push alerts to subscribed phones.
// Needs repo secrets: VAPID_PRIVATE (key) and PUSH_SUBS (one subscription code per line, from the app's Alerts setting).
// Remembers what it already sent in push-state.json (kept between runs by the Actions cache).
import webpush from 'web-push';
import { readFile, writeFile } from 'node:fs/promises';

const PUBLIC = 'BB4mO8LsX8OLTRYJgJPGEdFQH9Ofgne7AM9h8L0w-vEa-88MSRwvaxVhTUcUguN73bMSZDoJxDhLvhtSehGglMg';
const { VAPID_PRIVATE, PUSH_SUBS } = process.env;
const ALERT_SECTIONS = ['national', 'sc'];
const MAX_AGE_MIN = 60;
const MAX_PER_RUN = 3;

if (!VAPID_PRIVATE || !PUSH_SUBS?.trim()) { console.log('push: no subscribers configured, skipping'); process.exit(0); }

const subs = PUSH_SUBS.split(/\s+/).filter(Boolean).map((code) => {
  try { return JSON.parse(Buffer.from(code, 'base64').toString('utf8')); } catch { return null; }
}).filter((s) => s?.endpoint);

let state = { sent: [] };
try { state = JSON.parse(await readFile('push-state.json', 'utf8')); } catch {}
const firstRun = !state.sent.length;

const data = JSON.parse(await readFile('data/news.json', 'utf8'));
const fresh = ALERT_SECTIONS.flatMap((id) => data.articles[id] || [])
  .filter((a) => a.breaking && Date.now() - a.time < MAX_AGE_MIN * 60e3 && !state.sent.includes(a.link))
  .sort((a, b) => b.time - a.time);

webpush.setVapidDetails('mailto:news-bot@users.noreply.github.com', PUBLIC, VAPID_PRIVATE);
// On the very first run just record what's out there, so you don't get a burst of old alerts.
const toSend = firstRun ? [] : fresh.slice(0, MAX_PER_RUN);
for (const a of toSend) {
  const payload = JSON.stringify({ title: `Breaking · ${data.sections[a.section]}`, body: a.title, url: a.link, tag: a.link });
  for (const s of subs) {
    try { await webpush.sendNotification(s, payload, { TTL: 3600, urgency: 'high' }); console.log(`push: sent "${a.title}"`); }
    catch (e) { console.log(`push: failed (${e.statusCode || e.message})${e.statusCode === 410 ? ' — subscription expired, turn alerts on again in the app' : ''}`); }
  }
}
state.sent = [...fresh.map((a) => a.link), ...state.sent].slice(0, 500);
await writeFile('push-state.json', JSON.stringify(state));
console.log(`push: ${subs.length} subscriber(s), ${toSend.length} alert(s)${firstRun ? ' (first run: recorded only)' : ''}`);
