import { useAppSelector } from '@data/hooks'
import { NFTMeta } from '@data/slices/user'
import { useWeb3Contracts } from '@hooks/useWeb3Contracts'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import RarityJSON from '../../public/rarityRecord.json'

interface NFTListItemProps {
  // eslint-disable-next-line no-unused-vars
  openOverlay: () => void
  tokenId: number
}

const Rarity: { [tradeType: string]: { [value: string]: number } } = RarityJSON

export const NFTListItem: React.FC<NFTListItemProps> = ({
  tokenId,
}) => {
  const [NFT, setNFT] = useState<NFTMeta>()
  const [maxSize, setMaxSize] = useState<number>(999)

  const NFTs = useAppSelector((state) => state.user.NFTs)

  const { nft } = useWeb3Contracts()

  const getNFTAttributes = () =>
    NFT?.attributes.map((item, index) => {
      return (
        item.trait_type.toLowerCase() !== 'size' && (
          <div
            key={index + tokenId}
            className={`flex w-full justify-between ${
              index % 2 == 0 && 'bg-white bg-opacity-5'
            } ${
              Rarity[item.trait_type]['TOP_RARITY'] >=
                Rarity[item.trait_type][item.value] && 'text-dmss-accent1-100'
            }`}
          >
            <div className="flex justify-between flex-grow pr-2 space-x-4">
              <span className="font-extrabold">{item.trait_type}</span>
              <span>{item.value}</span>
            </div>
            {item.trait_type != 'Is it a NFT?' &&
              item.trait_type != 'Does it belong to the space squad?' && (
                <span
                  className={`w-10 text-right${
                    Rarity[item.trait_type]['TOP_RARITY'] >=
                      Rarity[item.trait_type][item.value] && 'text-dmss-accent1-100'
                  }`}
                >
                  {Rarity[item.trait_type][item.value]}%
                </span>
              )}
          </div>
        )
      )
    })

  useEffect(() => {
    const loadSize = async () => {
      if (nft && maxSize == 999) {
        setMaxSize((await nft.MAX_SIZE()).toNumber())
      }
    }

    loadSize()
  }, [maxSize, nft])

  useEffect(() => {
    if (NFTs) {
      setNFT(NFTs.filter((d) => d.tokenId == tokenId)[0])
    }
  }, [NFTs, tokenId])

  return (
    <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-8 lg:space-y-0 lg:space-x-4 2xl:space-x-12 rounded-lg">
      <div className="relative h-72 w-72 rounded-lg shadow bg-gray-900 bg-opacity-30 backdrop-blur-sm z-0">
        {NFT?.image != 'unrevealed' && (
          <div className="absolute inset-0 flex justify-center items-center backdrop-blur-sm">
            <div className="animate-pulse">Loading NFT ...</div>
          </div>
        )}

        <div className="absolute inset-0 rounded-lg z-0 overflow-hidden">
          <Image
            src={
              NFT?.image == 'unrevealed'
                ? '/unrevealed.gif'
                : process.env.NEXT_PUBLIC_IPFS_NODE +
                  NFT?.image.replace('ipfs://', '')
            }
            alt={`Picture of NFT  #${tokenId}`}
            width={500}
            height={500}
          />
        </div>

        <span className="absolute -bottom-8 inset-x-0 text-center font-extrabold text-lg text-gray-200">
          ID #{tokenId}
        </span>
      </div>

      <div className="relative flex-grow space-y-8 p-6 max-w-xl overflow-hidden rounded-lg bg-gray-900 bg-opacity-30 backdrop-blur-sm">
        <span className="font-extrabold text-2xl text-dmss-accent1-50">
          {NFT ? NFT.name : '?'}
        </span>
        <div className="flex flex-col">
          <span className="font-extrabold text-2xl">Attributes</span>
          <div className="pl-0 pt-3 flex flex-col text-lg">
            {getNFTAttributes()}
          </div>
        </div>
        <div className="flex flex-col items-start justify-between space-y-4">
          <div className="space-x-4">
            <span className="font-extrabold text-4xl">Size</span>
            <span className="font-extrabold text-5xl text-dmss-accent1-50">
              {NFT && NFT.size ? NFT.size : '?'}
            </span>
          </div>
          <div className="w-full h-4 rounded-full bg-white bg-opacity-10 overflow-hidden shadow-md">
            {NFT && NFT.size > 0 && (
              <div
                className={`w-${NFT?.size}/5 h-full rounded-full bg-gradient-to-tr from-dmss-accent1-100 hover:from-dmss-accent1-50 to-dmss-accent1-50`}
              />
            )}
          </div>

          {/* {NFT && NFT.size < maxSize ? (
            <button
              className="px-8 font-extrabold bg-dmss-accent1-100 hover:bg-dmss-accent1-50 shadow-lg py-2 rounded-full text-lg"
              onClick={() => openOverlay()}
            >
              Grow
            </button>
          ) : (
            <div className="opacity-60">
              {NFT && NFT.size
                ? 'Maximal Size reached'
                : 'Cannot grow unrevealed NFT '}
            </div>
          )} */}
        </div>
      </div>
    </div>
  )
}
