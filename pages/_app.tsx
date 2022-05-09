import React from 'react'
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import {Hydrate, QueryClient, QueryClientProvider} from 'react-query'

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp
