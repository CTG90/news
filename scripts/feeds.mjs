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
      { name: 'WIS', url: 'https://www.wistv.com/arc/outboundfeeds/rss/?outputType=xml' },
      { name: 'WMBF', url: 'https://www.wmbfnews.com/arc/outboundfeeds/rss/?outputType=xml' },
      { name: 'Live 5', url: 'https://www.live5news.com/arc/outboundfeeds/rss/?outputType=xml' },
      { name: 'WPDE', url: 'https://wpde.com/news/local.rss' },
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
  sports: {
    label: 'Sports',
    feeds: [
      { name: 'CBS Sports', url: 'https://www.cbssports.com/rss/headlines/' },
      { name: 'Yahoo Sports', url: 'https://sports.yahoo.com/rss/' },
      { name: 'The Athletic', url: 'https://www.nytimes.com/athletic/rss/news/' },
      { name: 'Google News', url: gnTopic('SPORTS'), fallback: true },
    ],
  },
  entertainment: {
    label: 'Entertainment',
    feeds: [
      { name: 'Variety', url: 'https://variety.com/feed/' },
      { name: 'Deadline', url: 'https://deadline.com/feed/' },
      { name: 'Hollywood Reporter', url: 'https://www.hollywoodreporter.com/feed/' },
      { name: 'IGN', url: 'https://feeds.feedburner.com/ign/all' },
      { name: 'Google News', url: gnTopic('ENTERTAINMENT'), fallback: true },
    ],
  },
  science: {
    label: 'Science',
    feeds: [
      { name: 'ScienceDaily', url: 'https://www.sciencedaily.com/rss/top/science.xml' },
      { name: 'Ars Technica', url: 'https://feeds.arstechnica.com/arstechnica/science' },
      { name: 'Space.com', url: 'https://www.space.com/feeds/all' },
      { name: 'NASA', url: 'https://www.nasa.gov/news-release/feed/' },
      { name: 'Google News', url: gnTopic('SCIENCE'), fallback: true },
    ],
  },
  health: {
    label: 'Health & Fitness',
    feeds: [
      { name: 'NPR', url: 'https://feeds.npr.org/1128/rss.xml' },
      { name: 'ScienceDaily', url: 'https://www.sciencedaily.com/rss/top/health.xml' },
      { name: "Men's Health", url: 'https://www.menshealth.com/rss/all.xml/' },
      { name: 'Stronger by Science', url: 'https://www.strongerbyscience.com/feed/' },
      { name: 'Google News', url: gnTopic('HEALTH'), fallback: true },
    ],
  },
  rides: {
    label: 'Rides',
    feeds: [
      { name: 'RideApart', url: 'https://www.rideapart.com/rss/articles/all/' },
      { name: 'Asphalt & Rubber', url: 'https://www.asphaltandrubber.com/feed/' },
      { name: 'Road & Track', url: 'https://www.roadandtrack.com/rss/all.xml/' },
      { name: 'Motor1', url: 'https://www.motor1.com/rss/articles/all/' },
      { name: 'The Drive', url: 'https://www.thedrive.com/feed' },
      { name: 'Car and Driver', url: 'https://www.caranddriver.com/rss/all.xml/' },
      { name: 'Google News', url: gn('(motorcycle OR Harley-Davidson OR Indian Motorcycle) when:3d'), fallback: true },
    ],
  },
  photography: {
    label: 'Photography',
    feeds: [
      { name: 'PetaPixel', url: 'https://petapixel.com/feed/' },
      { name: 'Fuji Rumors', url: 'https://www.fujirumors.com/feed/' },
      { name: 'DPReview', url: 'https://www.dpreview.com/feeds/news.xml' },
      { name: 'Digital Camera World', url: 'https://www.digitalcameraworld.com/feeds/all' },
      { name: 'Google News', url: gn('(Fujifilm OR camera OR photography) when:3d'), fallback: true },
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

// BREAKING tag rules (only National, South Carolina and Politics stories under 4 hours old).
// STRONG words tag on their own. WEAK words also need a hard-news word and no EXCLUDE word.
export const BREAKING_SECTIONS = ['national', 'sc', 'politics'];
export const BREAKING_STRONG = [
  'breaking:', 'shooting', 'shooter', 'gunman', 'gunfire', 'plane crash', 'helicopter crash', 'derail',
  'explosion', 'evacuat', 'manhunt', 'lockdown', 'tornado warning', 'hurricane', 'wildfire', 'earthquake',
  'amber alert', 'active threat', 'stabbing', 'hostage', 'bomb threat', 'mass casualty',
];
export const BREAKING_WEAK = ['crash', 'killed', 'dead', 'dies', 'collapse', 'emergency', 'fire', 'missing', 'tornado'];
export const BREAKING_HARD = ['police', 'sheriff', 'deputies', 'troopers', 'officials', 'victim', 'injured', 'hospital', 'fatal', 'highway', 'interstate', 'i-95', 'i-20', 'i-26', 'school', 'storm', 'rescue', 'apartment', 'home', 'county', 'scene'];
export const BREAKING_EXCLUDE = ['market', 'stock', 'crypto', 'bitcoin', 'course', 'box office', 'season', 'game', 'nfl', 'nba', 'ratings', 'review', 'opinion', 'podcast', 'recipe', 'anniversary', 'years ago', 'documentary', 'trailer'];
