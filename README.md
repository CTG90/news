# Coke's News

Live at **https://ctg90.github.io/news/**

A free, Apple News–style news app with 13 sections: National, South Carolina, Politics, Tech, Sneakers, Stocks, Economy, Sports, Entertainment, Science, Health & Fitness, Rides (motorcycles and autos) and Photography. It also has a breaking-news banner, a market strip, and an Edit button to hide or reorder sections.

## How it works
- A GitHub Action (`.github/workflows/update-news.yml`) runs every 30 minutes and executes `scripts/fetch-news.mjs`.
- That script pulls the free RSS feeds listed in `scripts/feeds.mjs` along with market quotes (CNBC, with Yahoo as backup), removes duplicate stories, flags breaking stories and writes the result to `data/news.json`.
- GitHub Pages serves `index.html`, which reads `data/news.json`. There are no API keys, servers or subscriptions.

## Setup (one time)
1. Push this folder to a GitHub repo.
2. Go to **Settings → Pages → Build and deployment** and set Source to *Deploy from a branch*, with branch `main` and folder `/ (root)`.
3. Go to **Actions → Update news → Run workflow** to do the first fill. After that it runs on its own.
4. On your iPhone, open `https://<user>.github.io/<repo>/` in Safari, tap **Share**, then **Add to Home Screen**.

## Customize
- **Sources:** edit `scripts/feeds.mjs`. Each section is a list of `{ name, url }`, and a feed that fails is skipped automatically.
- **Watchlist:** edit the `TICKERS` list in the same file. Each entry has a CNBC symbol and a Yahoo backup symbol (e.g. `{ cnbc: 'AMD', sym: 'AMD', label: 'AMD' }`).
- **Feed health:** `data/report.txt` shows how many stories each source returned on the last run and which ones failed.
- **Breaking keywords:** edit `BREAKING_WORDS`. A story is tagged only if it matches and is less than 6 hours old.
