import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import GaugeChart from 'react-gauge-chart'
import Link from 'next/link'
import Footer from '../components/Footer'

export async function getServerSideProps() {
  const getCryptoIndex: Index.Crypto = await fetch('https://api.alternative.me/fng/?limit=100').then(res => res.json())
  const getStockIndex: Index.Stock = await fetch('https://fear-and-greed-index.p.rapidapi.com/v1/fgi', {method: 'GET', headers: {'X-RapidAPI-Host': RAPIDAPI_HOST, 'X-RapidAPI-Key': process.env.RAPIDAPI_KEY}})
  .then(res => res.json())

  return {
    props: {getCryptoIndex, getStockIndex},
  }
}

namespace Index {
  export type Crypto = {
    name: string
    data: {
        value: string,
  value_classification: string,
  timestamp: string,
  time_until_update: string,
    }[]
    }
    export type Stock = {
        lastUpdated: {       
              epochUnixSeconds: number,
              humanDate: string,
        }
        fgi: {
          now: {
              value: number
              valueText: string
          },
          previousClose: {
              value: number
              valueText: string
          },
          oneWeekAgo: {
              value: number
              valueText: string
          },
          oneMonthAgo: {
              value: number
              valueText: string
          },
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

  const Home: NextPage<IndexProps> = ({getCryptoIndex, getStockIndex}) => {

  return (
    <div className={styles.container}>
      <Head>
        <title>Fear and Greed Index</title>
        <meta name="description" content="Check out the greed and fear index of the crypto currencies and stock market." />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <main className={styles.main}>

        <h1 className={styles.title}>
          {getCryptoIndex.name}
        </h1>

        <div className={styles.description}>
          Check out the greed and fear index of the crypto currencies and stock market.
        </div>

        <div className={styles.grid}>
        <Link href="https://edition.cnn.com/markets/fear-and-greed">
          <a target="_blank" className={styles.card}>
          <h2>Stock &rarr;</h2>
          <GaugeChart id="gauge-chart2" 
        nrOfLevels={20} 
        colors={['#EA4228', '#F5CD19', '#5BE12C']}
        percent={getStockIndex.fgi.now.value/100} 
        textColor="#000000"
        formatTextValue={() => getStockIndex.fgi.now.valueText+ ' ('+getStockIndex.fgi.now.value+')'}
      />
          </a>
          </Link>
          

          <Link href="https://alternative.me/crypto/fear-and-greed-index/">
          <a target="_blank" className={styles.card}>
          <h2>Crypto &rarr;</h2>
          <GaugeChart id="gauge-chart2" 
            nrOfLevels={20} 
            colors={['#EA4228', '#F5CD19', '#5BE12C']}
            percent={parseInt(getCryptoIndex.data[0].value)/100} 
            textColor="#000000"
            formatTextValue={() => getCryptoIndex.data[0].value_classification +' ('+getCryptoIndex.data[0].value+')'}
          />
          </a>
          
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Home
