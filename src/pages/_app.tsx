import { Web3Provider } from '@ethersproject/providers'
import { Web3ReactProvider } from '@web3-react/core'
// import { ThemeProvider } from 'next-themes'
import { AppProps } from 'next/app'
import Head from 'next/head'
import React from 'react'
import { Provider } from 'react-redux'
import 'tailwindcss/tailwind.css'
import '@css/customStyles.css'
import '@css/global.css'
import { store } from '../data/store'

function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider)
  library.pollingInterval = 12000

  return library
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      {/* <ThemeProvider attribute="class"> */}
      <Provider store={store}>
        <Head>
          {/* meta used by all routes */}
          <link rel="icon" href="favicon.png" />

          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta charSet="utf-8" />
          <meta key="robots" name="robots" content="noindex,follow" />
        </Head>
        <Component {...pageProps} />
      </Provider>
      {/* </ThemeProvider> */}
    </Web3ReactProvider>
  )
}

export default MyApp
