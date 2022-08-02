import { Layout } from '@components/Layout'
import { MintPillCard } from '@components/MintPillCard'
import { useAppSelector } from '@data/hooks'
import createWithApollo from '@utils/apollo/withApollo'
import { getRandomLoadingMessage } from '@utils/getRandomLoadingMessage'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'

const PharmacyPage = () => {
  const pillSoldOut = useAppSelector((state) => state.saleData.pillSoldOut)
  const loading = useAppSelector((state) => state.saleData.loading)
  const pharmacyIsOpen = useAppSelector((state) => state.saleData.pharmacyIsOpen)
  const price = useAppSelector((state) => state.saleData.pillPrice)
  const error = useAppSelector((state) => state.saleData.error)
  const pillClaim = useAppSelector((state) => state.user.user?.pillClaim || 0)

  const [loadingMessage, setLoadingMessage] = useState<string>('Loading...')

  useEffect(() => {
    setLoadingMessage(getRandomLoadingMessage())
  }, [])

  const drawError = () => <div>{error}</div>

  const drawLoading = () => (
    <div className="font-extrabold animate-pulse text-3xl px-8 text-center">
      {loadingMessage}
    </div>
  )

  const drawMint = () =>
    pharmacyIsOpen ? (
      <MintPillCard price={price} soldOut={pillSoldOut} pillClaim={pillClaim} />
    ) : (
      drawClosed()
    )

  const drawClosed = () => (
    <div className="flex flex-col items-start cursor-default border-l-8 border-white pl-4 smd:pl-6 md:pl-8 z-10">
      <span className="text-6xl sm:text-8xl md:text-9xl font-extrabold hover:text-dmss-accent1-50 transition-colors">
        Not
      </span>
      <span className="text-6xl sm:text-8xl md:text-9xl font-extrabold hover:text-dmss-accent1-50 transition-colors">
        available
      </span>
      <span className="text-6xl sm:text-8xl md:text-9xl font-extrabold hover:text-dmss-accent1-50 transition-colors">
        yet
      </span>
    </div>
  )

  return (
    <Layout showNav={false}>
      <Head>
        <title>💊 DMSS Pharmacy 💊</title>
        <meta
          key="title"
          property="og:title"
          content="NFT  Space Squad Pharmacy"
        />
        <meta
          key="description"
          property="og:description"
          content="Welcome to the Pharmacy. Here you can find and purchase Enlargement Pills to grow your NFT ."
        />
        <meta key="robots" name="robots" content="index,follow" />
      </Head>

      <div className="flex justify-center items-center w-full h-full">
        {loading ? drawLoading() : error ? drawError() : drawMint()}
      </div>
    </Layout>
  )
}

export default createWithApollo({ ssr: false })(PharmacyPage)
