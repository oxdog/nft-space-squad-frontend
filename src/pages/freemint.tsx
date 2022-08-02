import { Layout } from '@components/Layout'
import { MintNFTCard } from '@components/MintNFTCard'
import { useAppSelector } from '@data/hooks'
import { InformationCircleIcon } from '@heroicons/react/solid'
import createWithApollo from '@utils/apollo/withApollo'
import { getRandomLoadingMessage } from '@utils/getRandomLoadingMessage'
// import { clampNumber } from '@utils/math/clampNumber'
import { delay } from '@utils/misc/delay'
import { getTimeUntilUTCDate } from '@utils/misc/getTimeUntilUTCDate'
import { useWeb3React } from '@web3-react/core'
import moment from 'moment'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'

const PreSalePage = () => {
  const totalSupply = useAppSelector((state) => state.saleData.totalSupply)
  const loading = useAppSelector((state) => state.saleData.loading)
  const error = useAppSelector((state) => state.saleData.error)
  const { account } = useWeb3React()

  const [loadingMessage, setLoadingMessage] = useState<string>('Loading...')

  const [days, setDays] = useState<number>(0)
  const [hours, setHours] = useState<number>(0)
  const [minutes, setMinutes] = useState<number>(0)
  const [seconds, setSeconds] = useState<number>(0)

  const [pacemakerInit, setPacemakerInit] = useState<boolean>(false)
  const [countdownRunning, setCountdownRunning] = useState<boolean>(false)
  const [paceMaker, setPaceMaker] = useState<boolean>(false)

  useEffect(() => {
    const pacemakerClock = async () => {
      let lastOne = paceMaker
      // eslint-disable-next-line no-constant-condition
      while (true) {
        setPaceMaker(!lastOne)
        lastOne = !lastOne

        await delay(1000)
      }
    }

    if (!pacemakerInit) {
      pacemakerClock()
      setPacemakerInit(true)
    }
  }, [paceMaker, pacemakerInit])

  useEffect(() => {
    const [, months, days, hours, minutes, seconds] = getTimeUntilUTCDate(
      process.env.NEXT_PUBLIC_PRESALE_DATE
    )

    if (months > 0 || days > 0 || hours > 0 || minutes > 0 || seconds > 0) {
      setDays(days)
      setHours(hours)
      setMinutes(minutes)
      setSeconds(seconds)

      setCountdownRunning(true)
    } else {
      setSeconds(0)

      setCountdownRunning(false)
    }
  }, [paceMaker])

  useEffect(() => {
    if (loading) {
      setLoadingMessage(getRandomLoadingMessage())
    }
  }, [loading])

  const drawError = () => <div className="z-20">{error}</div>

  const drawLoading = () => (
    <div className="font-bold animate-pulse text-3xl px-8 text-center">
      {loadingMessage}
    </div>
  )

  const drawMint = () => (
    <div className="realtive flex flex-col items-center space-y-12 sm:space-y-16">
      <div className="flex flex-col items-center space-y-2 sm:space-y-4">
        <MintNFTCard
          price={process.env.NEXT_PUBLIC_PRESALE_NFT_PRICE}
          soldOut={totalSupply >= 507}
          mintLimit={20}
          usePreSale={true}
        />
        {/* <div className="flex flex-row justify-center space-x-2 px-4 py-2 rounded-lg border-dmss-accent1-100 border-2 bg-dmss-dark font-semibold z-10">
          <div className="text-xl font-bold">+</div>
          <div className="flex flex-col items-start">
            <div className="text-xl font-bold text-dmss-accent1-100">
              Echo 3 Membership
            </div>
            <div className="opacity-70">ONE per </div>
          </div>
        </div> */}
      </div>
      {/* {totalSupply < 9800 ? (
        <div className="sm:flex hidden flex-col items-center md:flex-row md:items-end md:space-x-2 space-y-2 md:space-y-0 z-20">
          <div className="text-2xl lg:text-3xl font-semibold">Free Mint</div>
          <div className="flex flex-row items-end space-x-2 z-20">
            <div className="text-3xl lg:text-4xl font-bold text-dmss-accent1-50">
              {clampNumber(totalSupply - 7, 0, 500)}
            </div>
            <div className="text-2xl lg:text-3xl font-semibold">of</div>
            <div className="text-3xl lg:text-4xl font-bold text-dmss-accent1-50">
              500
            </div>
          </div>
          <div className="text-2xl lg:text-3xl font-semibold">minted</div>
        </div>
      )  */}
      {totalSupply > 9800 && (
        <div className="sm:flex hidden flex-col items-center space-y-2 z-20">
          <div className="text-3xl lg:text-4xl font-bold text-dmss-accent1-50">
            Sold out
          </div>
        </div>
      )}
    </div>
  )

  const getTimeString = () => {
    if (days == 0 && hours == 0 && minutes == 0) {
      return `${seconds}s`
    } else if (days == 0 && hours == 0 && minutes > 0) {
      return `${minutes}m ${seconds}s`
    } else if (days == 0 && (hours > 0 || minutes > 0)) {
      return `${hours}h ${minutes}m ${seconds}s`
    } else {
      return `${days}d ${hours}h ${minutes}m ${seconds}s`
    }
  }
  const drawCountDown = () => {
    return (
      <div className="flex flex-col items-center space-y-4 md:space-y-6 lg:space-y-10 font-extrabold z-20">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex flex-col items-center space-y-4">
            <span className="text-4xl md:text-5xl lg:text-6xl text-dmss-accent1-100">
              Free Mint
            </span>
            <span className="text-2xl md:text-3xl lg:text-4xl">starts in</span>
          </div>
          <span className="text-4xl md:text-5xl lg:text-6xl text-dmss-accent1-100">
            {getTimeString()}
          </span>

          {!account && (
            <div className="flex items-center justify-center opacity-50">
              <InformationCircleIcon className="w-6 h-6 mr-2" />
              Connect your wallet to Mint
            </div>
          )}

          <span className="text-2xl px-2 text-center">
            {moment
              .utc(process.env.NEXT_PUBLIC_PRESALE_DATE)
              .format('MMMM Do YYYY, HH:mm')}
            UTC
          </span>
        </div>
      </div>
    )
  }

  return (
    <Layout showNav={false}>
      <Head>
        <title>⛏️ DMSS Minting ⛏️</title>
        <meta
          key="title"
          property="og:title"
          content="NFT  Space Squad Minting"
        />
        <meta
          key="description"
          property="og:description"
          content="Want to join the NFT  Space Squad? You came to the right place! Mint your NFT here."
        />
        <meta key="robots" name="robots" content="index,follow" />
      </Head>

      <div className="flex justify-center items-center w-full h-full pt-20">
        {countdownRunning
          ? drawCountDown()
          : loading
          ? drawLoading()
          : error
          ? drawError()
          : drawMint()}
      </div>
    </Layout>
  )
}

export default createWithApollo({ ssr: false })(PreSalePage)

// if loading -> draw loading
// if countdown not 0 -> draw countdown
// if !loading && countdown 0 -> draw mint
