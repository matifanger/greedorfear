import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import Footer from '../components/Footer'
import { useMemo } from 'react'
import GaugeChart from 'react-gauge-chart'
import { IoRocketSharp, IoTrendingUp, IoInformationCircle, IoTimeOutline, IoAnalytics } from 'react-icons/io5'
import { FaBitcoin } from 'react-icons/fa'

namespace Index {
  export type Crypto = {
    name: string
    data: {
      value: string
      value_classification: string
      timestamp: string
      time_until_update: string
    }[]
  }
  export type Stock = {
    lastUpdated: {
      epochUnixSeconds: number
      humanDate: string
    }
    fgi: {
      now: {
        value: number
        valueText: string
      }
      previousClose: {
        value: number
        valueText: string
      }
      oneWeekAgo: {
        value: number
        valueText: string
      }
      oneMonthAgo: {
        value: number
        valueText: string
      }
      oneYearAgo: {
        value: number
        valueText: string
      }
    }
  }
}

type IndexProps = {
  getCryptoIndex: Index.Crypto
  getStockIndex: Index.Stock
}

const IndexCard = ({ title, href, value, text }: { title: string; href: string; value: number; text: string }) => (
  <Link href={href}>
    <a target="_blank" className="glass-card group p-8 text-center rounded-2xl transition-all duration-500 hover:-translate-y-2 hover:neon-border relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink"></div>
      <h2 className="text-2xl font-bold mb-6 text-white flex items-center justify-center gap-3">
        {title === "Stock Market" ? 
          <IoTrendingUp className="text-neon-blue text-3xl" /> : 
          <FaBitcoin className="text-neon-pink text-3xl" />
        }
        {title}
      </h2>
      <GaugeChart
        id={`${title.toLowerCase()}-chart`}
        nrOfLevels={20}
        colors={['#EA4228', '#F5CD19', '#5BE12C']}
        percent={value}
        textColor="#ffffff"
        formatTextValue={() => text}
        cornerRadius={6}
        arcsLength={[0.3, 0.3, 0.4]}
        arcPadding={0.02}
        animate={true}
      />
      <div className="mt-6 text-sm text-white/70 group-hover:text-neon-blue transition-colors duration-300 flex items-center justify-center gap-2">
        View Analysis <IoAnalytics className="text-lg" />
      </div>
    </a>
  </Link>
);

export const getServerSideProps = async () => {
  const [getCryptoIndex, getStockIndex] = await Promise.all([
    fetch('https://api.alternative.me/fng/?limit=100').then(res => res.json()),
    fetch('https://fear-and-greed-index.p.rapidapi.com/v1/fgi', {
      headers: {
        'X-RapidAPI-Host': RAPIDAPI_HOST,
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY
      }
    }).then(res => res.json())
  ])

  return { props: { getCryptoIndex, getStockIndex } }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });
};

const HistoricalData = ({ stockIndex }: { stockIndex: Index.Stock }) => {
  const timeframes = useMemo(() => [
    { label: 'Previous Close', data: stockIndex.fgi.previousClose },
    { label: 'Week Ago', data: stockIndex.fgi.oneWeekAgo },
    { label: 'Month Ago', data: stockIndex.fgi.oneMonthAgo },
    { label: 'Year Ago', data: stockIndex.fgi.oneYearAgo },
  ], [stockIndex]);

  return (
    <div className="glass-card w-full max-w-6xl mx-auto rounded-2xl p-8 mt-16">
      <h3 className="text-2xl font-bold text-center flex items-center justify-center gap-3 mb-8">
        <IoTimeOutline className="text-neon-purple text-3xl" />
        <span className="text-gradient">Historical Data</span>
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {timeframes.map(({ label, data }) => (
          <div key={label} className="glass-card p-6 rounded-xl group hover:neon-border transition-all duration-300">
            <h4 className="text-lg font-medium text-white/70 mb-4">{label}</h4>
            <GaugeChart
              id={`stock-${label.toLowerCase().replace(' ', '-')}`}
              nrOfLevels={20}
              colors={['#EA4228', '#F5CD19', '#5BE12C']}
              percent={data.value / 100}
              textColor="#ffffff"
              formatTextValue={() => `${data.valueText} (${data.value})`}
              cornerRadius={6}
              arcsLength={[0.3, 0.3, 0.4]}
              arcPadding={0.02}
              animate={true}
              height={140}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const MarketInsights = ({ cryptoIndex, stockIndex }: { cryptoIndex: Index.Crypto; stockIndex: Index.Stock }) => {
  const insights = useMemo(() => {
    const cryptoValue = parseInt(cryptoIndex.data[0].value);
    const stockValue = stockIndex.fgi.now.value;
    
    return {
      divergence: Math.abs(cryptoValue - stockValue),
      marketState: cryptoValue > stockValue ? 'Crypto showing more optimism' : 'Traditional markets showing more optimism',
      overall: (cryptoValue + stockValue) / 2 > 50 ? 'Generally Greedy' : 'Generally Fearful'
    };
  }, [cryptoIndex, stockIndex]);

  return (
    <div className="glass-card w-full max-w-3xl mx-auto rounded-2xl p-8 mt-16">
      <h3 className="text-2xl font-bold text-center flex items-center justify-center gap-3 mb-8">
        <IoInformationCircle className="text-neon-blue text-3xl" />
        <span className="text-gradient">Market Analysis</span>
      </h3>
      <div className="space-y-4">
        <div className="glass-card p-6 rounded-xl hover:neon-border transition-all duration-300 group">
          <p className="text-lg flex items-center justify-between">
            <span className="text-white/70">Market Divergence</span>
            <span className="text-neon-blue font-mono">{insights.divergence} points</span>
          </p>
        </div>
        <div className="glass-card p-6 rounded-xl hover:neon-border transition-all duration-300 group">
          <p className="text-lg flex items-center justify-between">
            <span className="text-white/70">{insights.marketState}</span>
          </p>
        </div>
        <div className="glass-card p-6 rounded-xl hover:neon-border transition-all duration-300 group">
          <p className="text-lg flex items-center justify-between">
            <span className="text-white/70">Overall Market Sentiment</span>
            <span className="text-neon-blue font-mono">{insights.overall}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

const SeoContent = () => (
  <div className="glass-card w-full max-w-5xl mx-auto rounded-2xl p-4 md:p-8 mt-16">
    <h2 className="text-2xl md:text-3xl font-bold text-center flex items-center justify-center gap-3 mb-8">
      <IoInformationCircle className="text-neon-blue text-3xl" />
      <span className="text-gradient">Understanding Market Sentiment</span>
    </h2>

    <div className="space-y-6 md:space-y-8">
      {/* Index Components Section */}
      <div className="glass-card p-4 md:p-6 rounded-xl">
        <h3 className="text-xl font-bold text-white/90 mb-6">Index Components</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <div className="glass-card p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-neon-blue mb-4">Stock Market Metrics</h4>
            <ul className="space-y-3 text-white/70">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-neon-blue rounded-full"></span>
                Market Volatility (VIX)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-neon-blue rounded-full"></span>
                Market Momentum
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-neon-blue rounded-full"></span>
                Stock Price Strength
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-neon-blue rounded-full"></span>
                Market Volume
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-neon-blue rounded-full"></span>
                Put/Call Ratio
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-neon-blue rounded-full"></span>
                Safe Haven Demand
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-neon-blue rounded-full"></span>
                Junk Bond Demand
              </li>
            </ul>
          </div>
          
          <div className="glass-card p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-neon-pink mb-4">Crypto Market Metrics</h4>
            <ul className="space-y-3 text-white/70">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-neon-pink rounded-full"></span>
                Market Volatility
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-neon-pink rounded-full"></span>
                Market Momentum
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-neon-pink rounded-full"></span>
                Social Media Sentiment
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-neon-pink rounded-full"></span>
                Trading Volume
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-neon-pink rounded-full"></span>
                Bitcoin Dominance
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-neon-pink rounded-full"></span>
                Exchange Inflows/Outflows
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Index Interpretation Section */}
      <div className="glass-card p-4 md:p-6 rounded-xl">
        <h3 className="text-xl font-bold text-white/90 mb-6">Index Interpretation</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { level: 'Extreme Fear', range: '0-25', color: 'fear', description: 'Potential buying opportunity' },
            { level: 'Fear', range: '26-45', color: 'fear', description: 'Market uncertainty' },
            { level: 'Neutral', range: '46-55', color: 'neutral', description: 'Market stability' },
            { level: 'Greed', range: '56-75', color: 'greed', description: 'Consider taking profits' },
            { level: 'Extreme Greed', range: '76-100', color: 'greed', description: 'Market might be overvalued' },
          ].map(({ level, range, color, description }) => (
            <div key={level} 
              className="glass-card p-4 rounded-lg border-t-2 flex flex-col gap-2" 
              style={{ borderColor: `var(--color-${color})` }}
            >
              <h4 className="text-lg font-semibold text-white/90">{level}</h4>
              <p className="text-neon-blue font-mono">{range}</p>
              <p className="text-white/70 text-sm">{description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Trading Strategies Section */}
      <div className="glass-card p-4 md:p-6 rounded-xl">
        <h3 className="text-xl font-bold text-white/90 mb-6">Trading Strategies</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <div className="glass-card p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-neon-blue mb-4">Counter-Trend Strategy</h4>
            <ul className="space-y-3 text-white/70">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-neon-blue rounded-full"></span>
                Consider buying when fear is extreme (0-25)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-neon-blue rounded-full"></span>
                Consider selling when greed is extreme (76-100)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-neon-blue rounded-full"></span>
                Use dollar-cost averaging during extreme periods
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-neon-blue rounded-full"></span>
                Implement stop-losses to manage risk
              </li>
            </ul>
          </div>
          
          <div className="glass-card p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-neon-pink mb-4">Trend-Following Strategy</h4>
            <ul className="space-y-3 text-white/70">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-neon-pink rounded-full"></span>
                Enter positions when moving from fear to neutral
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-neon-pink rounded-full"></span>
                Exit positions when moving from greed to neutral
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-neon-pink rounded-full"></span>
                Use sentiment shifts to confirm technical analysis
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-neon-pink rounded-full"></span>
                Monitor volume for confirmation
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Disclaimer Section */}
      <div className="glass-card p-4 rounded-lg border-l-4 border-neon-purple bg-glass-dark">
        <p className="text-white/70 text-sm md:text-base">
          <strong className="text-neon-purple">Important:</strong> The Fear & Greed Index should be used alongside other technical and fundamental analysis tools.
        </p>
      </div>
    </div>
  </div>
);

const Home: NextPage<IndexProps> = ({ getCryptoIndex, getStockIndex }) => {
  return (
    <div className="min-h-screen grid-bg">
      <Head>
        <title>Greed Or Fear | Real-time Market Sentiment Index</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        {/* Primary Meta Tags */}
        <meta name="title" content="Greed Or Fear | Real-time Market Sentiment Index" />
        <meta name="description" content="Track real-time market sentiment with our AI-powered Fear & Greed Index. Compare crypto and stock market indicators, analyze historical data, and make informed trading decisions." />
        <meta name="keywords" content="greed or fear, fear and greed index, market sentiment, crypto market, stock market, trading psychology, market indicators, bitcoin sentiment, stock sentiment, market analysis, trading tools" />
        <meta name="author" content="Matias Fanger" />
        <meta name="theme-color" content="#000000" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://greedorfear.netlify.app/" />
        <meta property="og:title" content="Greed Or Fear | Real-time Market Sentiment Index" />
        <meta property="og:description" content="AI-powered market sentiment tracker for crypto and traditional markets. Make data-driven trading decisions with real-time fear and greed indicators." />
        <meta property="og:image" content="/favicon.png" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://greedorfear.netlify.app/" />
        <meta property="twitter:title" content="Greed Or Fear | Real-time Market Sentiment Index" />
        <meta property="twitter:description" content="AI-powered market sentiment tracker for crypto and traditional markets. Make data-driven trading decisions with real-time fear and greed indicators." />
        <meta property="twitter:image" content="/favicon.png" />
        
        {/* Favicon */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Additional Meta */}
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <meta name="google" content="notranslate" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        
        {/* Preconnect to important domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </Head>

      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/50 to-black opacity-90"></div>
      
      <main className="relative max-w-7xl mx-auto px-6 py-20">
        <h1 className="text-6xl font-bold text-center mb-6 flex items-center justify-center gap-4">
          <IoRocketSharp className="text-neon-blue text-5xl animate-pulse" />
          <span className="text-gradient animate-pulse-slow">Greed Or Fear</span>
        </h1>

        <p className="text-xl text-center text-white/70 mb-16 max-w-2xl mx-auto">
          Real-time sentiment analysis for smarter trading decisions
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <IndexCard
            title="Stock Market"
            href="https://edition.cnn.com/markets/fear-and-greed"
            value={getStockIndex.fgi.now.value / 100}
            text={`${getStockIndex.fgi.now.valueText} (${getStockIndex.fgi.now.value})`}
          />
          <IndexCard
            title="Crypto Market"
            href="https://alternative.me/crypto/fear-and-greed-index/"
            value={parseInt(getCryptoIndex.data[0].value) / 100}
            text={`${getCryptoIndex.data[0].value_classification} (${getCryptoIndex.data[0].value})`}
          />
        </div>

        <MarketInsights cryptoIndex={getCryptoIndex} stockIndex={getStockIndex} />
        <HistoricalData stockIndex={getStockIndex} />
        <SeoContent />

        <div className="text-center text-white/50 text-sm mt-16 font-mono">
          Last sync: {formatDate(getStockIndex.lastUpdated.humanDate)}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home
