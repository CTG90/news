# Coke's News

A free, Apple News–style news app: National, South Carolina, Politics, Tech, Sneakers, Stocks, Economy, plus a breaking-news banner and a market strip.

## How it works
- A GitHub Action (`.github/workflows/update-news.yml`) runs every 30 minutes and executes `scripts/fetch-news.mjs`.
- That script pulls the free RSS feeds listed in `scripts/feeds.mjs` along with Yahoo Finance quotes, removes duplicate stories, flags breaking stories and writes the result to `data/news.json`.
- GitHub Pages serves `index.html`, which reads `data/news.json`. There are no API keys, servers or subscriptions.

## Setup (one time)
1. Push this folder to a GitHub repo.
2. Go to **Settings → Pages → Build and deployment** and set Source to *Deploy from a branch*, with branch `main` and folder `/ (root)`.
3. Go to **Actions → Update news → Run workflow** to do the first fill. After that it runs on its own.
4. On your iPhone, open `https://<user>.github.io/<repo>/` in Safari, tap **Share**, then **Add to Home Screen**.

## Customize
- **Sources:** edit `scripts/feeds.mjs`. Each section is a list of `{ name, url }`, and a feed that fails is skipped automatically.
- **Watchlist:** edit the `TICKERS` list in the same file. It uses Yahoo symbols, e.g. `AMD` or `^RUT`.
- **Breaking keywords:** edit `BREAKING_WORDS`. A story is tagged only if it matches and is less than 6 hours old.
