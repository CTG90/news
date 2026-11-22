// Sources per section. Each section ends with a Google News fallback so it never comes up empty.
// Edit freely: add/remove { name, url } lines. Failed feeds are skipped automatically.
const gn = (q) => `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=en-US&gl=US&ceid=US:en`;
const gnTopic = (t) => `https://news.google.com/rss/headlines/section/topic/${t}?hl=en-US&gl=US&ceid=US:en`;

export const SECTIONS = {
  national: {
    label: 'National',
    feeds: [
      { name: 'NPR', url: 'https://feeds.npr.org/1001/rss.xml' },
      { name: 'ABC News', url: 'https://abcnews.go.com/abcnews/topstories' },
      { name: 'CBS News', url: 'https://www.cbsnews.com/latest/rss/us' },
      { name: 'NBC News', url: 'https://feeds.nbcnews.com/nbcnews/public/news' },
      { name: 'Fox News', url: 'https://moxie.foxnews.com/google-publisher/us.xml' },
      { name: 'Google News', url: gnTopic('NATION'), fallback: true },
    ],
  },
  sc: {
    label: 'South Carolina',
    feeds: [
      { name: 'SC Daily Gazette', url: 'https://scdailygazette.com/feed/' },
      { name: 'WBTW', url: 'https://www.wbtw.com/feed/' },
      { name: 'WSPA', url: 'https://www.wspa.com/feed/' },
      { name: 'WCBD', url: 'https://www.counton2.com/feed/' },
      { name: 'Post and Courier', url: 'https://www.postandcourier.com/search/?f=rss&t=article&c=news&l=40&s=start_time&sd=desc' },
      { name: 'SCNow', url: 'https://scnow.com/search/?f=rss&t=article&c=news&l=40&s=start_time&sd=desc' },
      { name: 'Google News', url: gn('"South Carolina" (police OR sheriff OR crash OR shooting OR governor OR legislature OR county OR SCDOT) -football -basketball -baseball -Gamecocks -Tigers when:2d'), fallback: true },
      { name: 'Google News', url: gn('(Florence OR "Pee Dee" OR Dillon OR Darlington) "SC" -football -basketball when:3d'), fallback: true },
    ],
  },
  politics: {
    label: 'Politics',
    feeds: [
      { name: 'NPR', url: 'https://feeds.npr.org/1014/rss.xml' },
      { name: 'Politico', url: 'https://rss.politico.com/politics-news.xml' },
      { name: 'The Hill', url: 'https://thehill.com/homenews/feed/' },
      { name: 'CBS News', url: 'https://www.cbsnews.com/latest/rss/politics' },
      { name: 'Fox News', url: 'https://moxie.foxnews.com/google-publisher/politics.xml' },
      { name: 'Washington Examiner', url: 'https://www.washingtonexaminer.com/feed/' },
      { name: 'Google News', url: gn('(Congress OR "White House" OR Senate OR Supreme Court) when:1d'), fallback: true },
    ],
  },
  tech: {
    label: 'Tech',
    feeds: [
      { name: 'The Verge', url: 'https://www.theverge.com/rss/index.xml' },
      { name: 'Ars Technica', url: 'https://feeds.arstechnica.com/arstechnica/index' },
      { name: 'TechCrunch', url: 'https://techcrunch.com/feed/' },
      { name: 'Engadget', url: 'https://www.engadget.com/rss.xml' },
      { name: '9to5Mac', url: 'https://9to5mac.com/feed/' },
      { name: 'Google News', url: gnTopic('TECHNOLOGY'), fallback: true },
    ],
  },
  sneakers: {
    label: 'Sneakers',
    feeds: [
      { name: 'Sneaker News', url: 'https://sneakernews.com/feed/' },
      { name: 'Nice Kicks', url: 'https://www.nicekicks.com/feed/' },
      { name: 'Hypebeast', url: 'https://hypebeast.com/footwear/feed' },
      { name: 'Sneaker Files', url: 'https://www.sneakerfiles.com/feed/' },
      { name: 'Highsnobiety', url: 'https://www.highsnobiety.com/feed/' },
      { name: 'Google News', url: gn('sneaker release when:3d'), fallback: true },
    ],
  },
  stocks: {
    label: 'Stocks',
    feeds: [
      { name: 'CNBC', url: 'https://www.cnbc.com/id/10000664/device/rss/rss.html' },
      { name: 'MarketWatch', url: 'https://feeds.content.dowjones.io/public/rss/mw_marketpulse' },
      { name: 'Seeking Alpha', url: 'https://seekingalpha.com/market_currents.xml' },
      { name: 'Investing.com', url: 'https://www.investing.com/rss/news_25.rss' },
      { name: 'Google News', url: gn('stock market when:1d'), fallback: true },
    ],
  },
  economy: {
    label: 'Economy',
    feeds: [
      { name: 'CNBC', url: 'https://www.cnbc.com/id/20910258/device/rss/rss.html' },
      { name: 'NPR', url: 'https://feeds.npr.org/1017/rss.xml' },
      { name: 'MarketWatch', url: 'https://feeds.content.dowjones.io/public/rss/mw_topstories' },
      { name: 'Calculated Risk', url: 'https://www.calculatedriskblog.com/feeds/posts/default?alt=rss' },
      { name: 'Google News', url: gnTopic('BUSINESS'), fallback: true },
    ],
  },
};

// Market strip. cnbc = CNBC quote symbol (primary), sym = Yahoo symbol (backup). Add your watchlist here.
export const TICKERS = [
  { cnbc: '.SPX', sym: '^GSPC', label: 'S&P 500' },
  { cnbc: '.IXIC', sym: '^IXIC', label: 'Nasdaq' },
  { cnbc: '.DJI', sym: '^DJI', label: 'Dow' },
  { cnbc: '.VIX', sym: '^VIX', label: 'VIX' },
  { cnbc: 'US10Y', sym: '^TNX', label: '10Y', suffix: '%' },
  { cnbc: 'BTC.CM=', sym: 'BTC-USD', label: 'Bitcoin' },
  { cnbc: '@CL.1', sym: 'CL=F', label: 'Oil' },
  { cnbc: '@GC.1', sym: 'GC=F', label: 'Gold' },
  { cnbc: 'AAPL', sym: 'AAPL', label: 'AAPL' },
  { cnbc: 'NVDA', sym: 'NVDA', label: 'NVDA' },
  { cnbc: 'TSLA', sym: 'TSLA', label: 'TSLA' },
];

// Headlines matching these, under 6 hours old, get a red BREAKING tag.
export const BREAKING_WORDS = [
  'breaking', 'shooting', 'shooter', 'gunman', 'shot dead', 'killed', 'dead after', 'plane crash',
  'crash', 'derail', 'explosion', 'evacuat', 'manhunt', 'lockdown', 'hurricane', 'tornado',
  'wildfire', 'earthquake', 'emergency', 'amber alert', 'active threat', 'collapse',
];
