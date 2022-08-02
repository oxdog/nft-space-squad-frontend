/* eslint-disable @next/next/no-page-custom-font */
import NextDocument, { Head, Html, Main, NextScript } from 'next/document'
import React from 'react'

export default class Document extends NextDocument {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="true"
          />

          <link
            href="https://fonts.googleapis.com/css2?family=Poppins:wght@600;800&display=swap"
            rel="stylesheet"
          />
        </Head>

        <body className="h-screen bg-gradient-radial from-dmss-bright to-dmss-dark text-white font-poppins">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
