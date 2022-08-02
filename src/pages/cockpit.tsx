import { NFTListItem } from '@components/NFTListItem'
import { GrowOverlay } from '@components/GrowOverlay'
import { Layout } from '@components/Layout'
import { OpenSeaButton } from '@components/OpenSeaButton'
import { useAppDispatch, useAppSelector } from '@data/hooks'
import { setPingIndicator } from '@data/slices/operations'
import createWithApollo from '@utils/apollo/withApollo'
import { useWeb3React } from '@web3-react/core'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

const CockpitPage = () => {
  const router = useRouter()

  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.user.user)
  const { account } = useWeb3React()

  const [growTarget, setGrowTarget] = useState<number>(0)
  const [showOverlay, setShowOverlay] = useState<boolean>(false)

  const openGrowOverlay = (target: number) => {
    setGrowTarget(target)
    setShowOverlay(true)
  }

  useEffect(
    () =>
      // @ts-ignore
      dispatch(setPingIndicator(false)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  useEffect(() => {
    if (!account) {
      router.push('/presale')
    }
  }, [account, router])

  return (
    <Layout showNav={false}>
      <Head>
        <title>🍆 DMSS Cockpit 🍆</title>
        <meta
          key="title"
          property="og:title"
          content="NFT  Space Squad Cockpit"
        />
        <meta
          key="description"
          property="og:description"
          content="This is your Cockpit. It is here for you to inspect your crew and resources."
        />
        <meta key="robots" name="robots" content="index,follow" />
      </Head>

      {showOverlay && (
        <GrowOverlay
          closeOverlay={() => setShowOverlay(false)}
          tokenId={growTarget}
        />
      )}

      <div className="absolute inset-0 w-screen mx-auto h-screen flex flex-row justify-between px-8 space-x-4 xl:px-16 2xl:px-48 z-0">
        {/* NFT Overview */}
        <div className="relative flex flex-col flex-grow lg:justify-start pt-8 sm:pt-16 lg:w-2/3 h-screen overflow-y-scroll no-scrollbar pb-24">
          {user && user.NFTIds.length > 0 ? (
            <div className="py-24 space-y-24 lg:space-y-32">
              {user &&
                user.NFTIds.map((tokenId, index) => (
                  <NFTListItem
                    key={index}
                    tokenId={tokenId}
                    openOverlay={() => openGrowOverlay(tokenId)}
                  />
                ))}
            </div>
          ) : (
            <div className="flex flex-col items-center pt-24 md:pt-48 space-y-16">
              <span className="font-extrabold text-2xl bg-gray-900 bg-opacity-30 backdrop-blur-sm p-2 rounded-lg">
                {/* eslint-disable-next-line react/no-unescaped-entities */}
                You don't own a NFT  yet
              </span>

              <div className="flex flex-col items-center space-y-6">
                <button
                  className="px-2 md:px-8 transition-colors font-extrabold border-2 bg-white hover:bg-opacity-20 bg-opacity-10 backdrop-blur-sm text-gray-200 py-2 rounded-full text-lg md:text-xl"
                  onClick={() => router.push('/presale')}
                >
                  ⛏️ Mint a new NFT  ⛏️
                </button>

                <OpenSeaButton />
              </div>
            </div>
          )}
        </div>

        {/* Pills */}
        <div className="hidden lg:flex pt-40 space-y-8 flex-col items-center">
          <div className="p-4 2xl:p-8 w-full flex flex-col rounded-lg bg-gray-900 bg-opacity-30 backdrop-blur-sm">
            <span className="font-extrabold text-2xl text-center mb-4">
              Your Crew Size
            </span>
            <div className="text-7xl transition-colors cursor-pointer text-center font-extrabold hover:text-dmss-accent1-50">
              {user ? user.NFTIds.length : '?'}
            </div>
          </div>
          {user && user.membershipCount > 0 && (
            <div className="p-4 2xl:p-8 w-full flex flex-col rounded-lg bg-gray-900 bg-opacity-30 backdrop-blur-sm">
              <span className="font-extrabold text-2xl text-center text-dmss-accent2-50">
                Company
              </span>
              <span className="font-extrabold text-2xl text-center mb-4">
                Membership Cards
              </span>
              <div className="text-7xl transition-colors cursor-pointer text-center font-extrabold hover:text-dmss-accent2-50">
                {user ? user.membershipCount : '?'}
              </div>
              <a
                href={process.env.NEXT_PUBLIC_OPENSEA_EMC_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-extrabold text-center mb-2 underline"
              >
                view on Opensea
              </a>
            </div>
          )}

          {/* <div className="p-4 2xl:p-8 w-full flex flex-col rounded-lg bg-gray-900 bg-opacity-30 backdrop-blur-sm">
            <span className="whitespace-nowrap text-center font-extrabold text-2xl mb-6">
              Enlargement Pills
            </span>
            <div className="pt-4 w-full flex flex-col items-center space-y-12">
              <div className="flex flex-row space-x-4 items-end font-extrabold">
                <span className="text-7xl">💊</span>
                <span className="text-2xl">x</span>
                <span className="text-5xl">
                  {user ? user.pillIds.length - user.blockedPillIds.length : '?'}
                </span>
              </div>

              <button
                className="whitespace-nowrap px-4 2xl:px-8 transition-colors font-extrabold border-2 bg-white hover:bg-opacity-20 bg-opacity-10 backdrop-blur-sm  py-2 rounded-full text-xl"
                onClick={() => router.push('/pharmacy')}
              >
                💊 Get more Pills 💊
              </button>
            </div>
          </div> */}
        </div>
      </div>
    </Layout>
  )
}

export default createWithApollo({ ssr: false })(CockpitPage)
