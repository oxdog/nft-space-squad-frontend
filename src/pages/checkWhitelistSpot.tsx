// import 'react-native-get-random-values' // Import the crypto getRandomValues shim (**BEFORE** the shims)
// import '@ethersproject/shims' /// Import the the ethers shims (**BEFORE** ethers)
import { Layout } from '@components/Layout'
import { useAppSelector } from '@data/hooks'
import createWithApollo from '@utils/apollo/withApollo'
import moment from 'moment'
import Head from 'next/head'
import React from 'react'
import { VscDebugDisconnect } from 'react-icons/vsc'

const CheckWhitelistSpotPage = () => {
  const account = useAppSelector((state) => state.user.user?.address)
  const error = useAppSelector((state) => state.saleData.error)

  const whitelistLeft = useAppSelector(
    (state) => state.user.user?.whitelistLeft || 0
  )
  const freeMintLeft = useAppSelector((state) => state.user.user?.freeMintLeft || 0)

  const drawError = () => <div>{error}</div>

  const displayAccount = () =>
    account
      ? account.substring(0, 5) + '...' + account.substring(account.length - 4)
      : ''

  const drawWhitelist = () => (
    <div className="flex flex-col items-start md:items-center space-y-8 md:space-y-16">
      {whitelistLeft || freeMintLeft ? (
        <>
          <div className="flex flex-col items-center space-y-8 md:space-y-16 z-10">
            <div className="flex flex-col items-center space-y-2 z-10">
              <span className="text-4xl px-1 text-dmss-accent1-100">
                Congratulations!
              </span>

              <span className="text-xl md:text-2xl">
                You are officially whitelisted
              </span>
            </div>

            <div className="flex flex-col items-center space-y-2 md:space-y-4 z-10">
              <span className="text-2xl md:text-3xl">Whitelisted for</span>
              <span className="text-4xl md:text-6xl px-1 text-dmss-accent1-100">
                {whitelistLeft} NFT 
                {whitelistLeft > 1 ? 's' : ''}
              </span>
              {freeMintLeft > 0 && (
                <div className="flex flex-col items-center space-y-1 md:space-y-2 space-x-1">
                  <span className="text-xl md:text-2xl font-bold">+</span>
                  <span className="text-4xl md:text-6xl text-dmss-accent1-100">
                    {freeMintLeft} Free Mint{freeMintLeft > 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-col items-center space-y-2 z-10">
              <span className="text-lg md:text-xl">
                Whitelisted Address: {displayAccount()}
              </span>

              <span className="text-xl md:text-2xl">
                {moment
                  .utc(process.env.NEXT_PUBLIC_WHITELIST_DATE)
                  .format('MMMM Do YYYY, HH:mm')}{' '}
                UTC
              </span>
            </div>
          </div>

          <div className="absolute bottom-8 sm:bottom-12 md:bottom-24 inset-x-0 px-2  flex justify-center">
            <span className="text-lg max-w-xl text-center bg-gray-900 bg-opacity-30 backdrop-blur-sm p-4 rounded-lg">
              Note: Whitelist spots are only reserved during the Whitelist Sale
              Period. Free Mints are reserved to claim for 1 month.
            </span>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col items-center space-y-8 md:space-y-12 2xl:space-y-16 z-10">
            <span className="text-4xl md:text-6xl">Oh no!</span>

            <div className="flex flex-col md:flex-row items-center md:items-end z-10">
              <span className="text-2xl px-1">It seems like</span>
              <span className="text-2xl px-1 text-dmss-accent1-50">
                {displayAccount()}
              </span>
              <span className="text-2xl px-1">is not whitelisted.</span>
            </div>

            <span className="px-4 md:text-lg text-center max-w-xl">
              If you are sure you have a whitelist spot please try your other
              addresses. If that does not resolve the issue feel free to reach out to
              us via Discord.
            </span>
          </div>

          <span className="px-4 bottom-24 md:text-lg opacity-80 max-w-xl text-center">
            Note: Make sure you copied your wallet address directly out of your
            wallet. Copying it from another source might format the address and cause
            issues registering it in the whitelist.
          </span>
        </>
      )}
    </div>
  )
  const drawPleaseConnect = () => (
    <div className="realtive flex flex-col items-center px-4 space-y-4 z-10 p-4 mx-2 rounded-lg bg-gray-900 bg-opacity-30 backdrop-blur-sm">
      <VscDebugDisconnect className="text-8xl mb-4 text-dmss-accent1-50" />

      <span className="text-4xl text-dmss-accent1-50">
        Please connect your wallet
      </span>

      <span className="text-xl">
        So we can confirm you officially have a whitelist spot
      </span>
    </div>
  )

  return (
    <Layout showNav={false}>
      <Head>
        <title>📜 DMSS Whitelist 📜</title>
        <meta
          key="title"
          property="og:title"
          content="NFT  Space Squad Whitelist"
        />
        <meta
          key="description"
          property="og:description"
          content="On this page your can confirm your whitelist spot at the NFT  Space Squad Minting"
        />
        <meta key="robots" name="robots" content="index,follow" />
      </Head>

      {/* <div className="flex flex-col items-center space-y-8 pt-48"> */}
      <div className="flex justify-center items-center w-full h-full">
        {error ? drawError() : account ? drawWhitelist() : drawPleaseConnect()}
      </div>
    </Layout>
  )
}

export default createWithApollo({ ssr: false })(CheckWhitelistSpotPage)
