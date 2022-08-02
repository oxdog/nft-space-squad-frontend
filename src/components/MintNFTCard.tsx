import { useAppDispatch, useAppSelector } from '@data/hooks'
import {
  manageOperationInPool,
  Operation,
  OPStatus,
  OPType,
  removeOperation,
  setOperation,
} from '@data/slices/operations'
import { InformationCircleIcon } from '@heroicons/react/solid'
import { useWeb3Contracts } from '@hooks/useWeb3Contracts'
import { getWhitelistMerkleTree } from '@utils/getWhitelistMerkleTree'
import { hashToken } from '@utils/hashToken'
import { delay } from '@utils/misc/delay'
import { useWeb3React } from '@web3-react/core'
import { utils } from 'ethers'
import Image from 'next/image'
import React, { useState } from 'react'
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai'
import { v4 as uuidv4 } from 'uuid'

interface MintNFTCardProps {
  price: string | undefined
  soldOut: boolean
  mintLimit: number | undefined
  usePreSale: boolean | undefined
}

export const MintNFTCard: React.FC<MintNFTCardProps> = ({
  price,
  soldOut,
  mintLimit = 5,
  usePreSale = false,
}) => {
  const { distributor, presale } = useWeb3Contracts()
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()
  const [quantity, setQuantity] = useState<number>(1)
  const spotConfig = useAppSelector(
    (state) =>
      state.user.user?.spotConfig || {
        whitelist: 0,
        freeMint: 0,
      }
  )
  const freeMintLeft = useAppSelector((state) => state.user.user?.freeMintLeft || 0)
  const merkleTree = getWhitelistMerkleTree()

  const increment = () => quantity < mintLimit && setQuantity(quantity + 1)
  const decrement = () => quantity > 1 && setQuantity(quantity - 1)

  const mint = async () => {
    try {
      if (!account) {
        throw new Error('Connect Wallet')
      }

      let result: any
      const price = usePreSale
        ? utils.parseEther(process.env.NEXT_PUBLIC_PRESALE_NFT_PRICE)
        : utils.parseEther(process.env.NEXT_PUBLIC_DEFAULT_NFT_PRICE)

      if (usePreSale) {
        if (!presale) {
          throw new Error('No Presale')
        }
        // ! FREEMINT
        result = await presale.mintNewNFTs(quantity)

        // result = await presale.mintNewNFTs(quantity, {
        //   value: price.mul(quantity),
        // })
      } else {
        if (!distributor) {
          throw new Error('No Distributor')
        }
        result = await distributor.mintNewNFTs(
          quantity,
          spotConfig,
          merkleTree.getHexProof(
            hashToken(account, spotConfig.whitelist, spotConfig.freeMint)
          ),
          {
            value: price.mul(quantity),
            gasLimit: 800_000,
          }
        )
      }

      const data = {
        type: OPType.MINT,
        description: `Minting ${quantity} NFT ${quantity > 1 ? 's' : ''}`,
      }

      dispatch(manageOperationInPool({ result, data }))
    } catch (error: any) {
      if (error.message?.includes('insufficient funds')) {
        const operation: Operation = {
          id: uuidv4(),
          status: OPStatus.FAILED,
          hash: undefined,
          type: OPType.MINT,
          description: 'Insufficient funds on Wallet',
        }

        dispatch(setOperation(operation))
        await delay(5000)
        dispatch(removeOperation(operation.id))
      }

      if (error.code === 4001) {
        const operation: Operation = {
          id: uuidv4(),
          status: OPStatus.FAILED,
          hash: undefined,
          type: OPType.MINT,
          description: `Cancelled minting ${quantity} NFT ${
            quantity > 1 ? 's' : ''
          }`,
        }

        dispatch(setOperation(operation))
        await delay(5000)
        dispatch(removeOperation(operation.id))
      }
    }
  }

  // const claim = async () => {
  //   try {
  //     if (!distributor || !account) {
  //       throw new Error('No Distributor or Account')
  //     }

  //     const result = await distributor.claimFreeMint(
  //       freeMintLeft,
  //       spotConfig,
  //       merkleTree.getHexProof(
  //         hashToken(account, spotConfig.whitelist, spotConfig.freeMint)
  //       )
  //     )

  //     const data = {
  //       type: OPType.MINT,
  //       description: `Claiming ${freeMintLeft} NFT ${
  //         freeMintLeft > 1 ? 's' : ''
  //       }`,
  //     }

  //     dispatch(manageOperationInPool({ result, data }))
  //   } catch (error: any) {
  //     if (error.code === 4001) {
  //       const operation: Operation = {
  //         id: uuidv4(),
  //         status: OPStatus.FAILED,
  //         hash: undefined,
  //         type: OPType.MINT,
  //         description: `Cancelled claiming ${quantity} NFT ${
  //           quantity > 1 ? 's' : ''
  //         }`,
  //       }

  //       dispatch(setOperation(operation))
  //       await delay(5000)
  //       dispatch(removeOperation(operation.id))
  //     }
  //   }
  // }

  const drawSoldOut = () => (
    <div className="absolute cursor-default inset-0 flex items-center justify-center bg-dmss-dark bg-opacity-50 whitespace-nowrap rounded-lg z-10">
      <div className="text-8xl mb-8 font-extrabold text-dmss-error border-8 border-dmss-error shadow-lg bg-gradient-to-tr from-dmss-dark-black to-dmss-dark transform rotate-12 rounded-lg p-8">
        Sold out!
      </div>
    </div>
  )

  return (
    <div className="relative flex flex-col w-64 md:w-72 rounded-lg border-b-4 border-dmss-accent1-100 shadow-2xl shadow-cyan-300">
      {usePreSale && (
        <div className="absolute flex-col item-center justify-center -right-4 px-2 py-1 rounded-lg bg-white text-dmss-error font-semibold z-10 transform rotate-12">
          <div className="text-2xl font-bold">FREE MINT</div>
        </div>
      )}
      {soldOut && drawSoldOut()}
      <div className="relative bg-white bg-opacity-10 rounded-t-lg flex items-center justify-center flex-grow overflow-hidden">
        <Image
          src={`/gif/mint.gif`}
          alt="Gif of NFTs"
          blurDataURL="/randomNFT.jpeg"
          placeholder="blur"
          width={300}
          height={300}
        />
        <div className="absolute inset-0 bg-gradient-to-bl from-dmss-accent1-50 to-transparent opacity-50" />
        <div className="absolute inset-0 transition-colors bg-transparent hover:bg-white opacity-20 mix-blend-lighten blur-lg" />
        <div className="absolute inset-0 cursor-default pointer-events-none flex items-center justify-center font-extrabold text-9xl animate-pulse">
          ?
        </div>
        <span className="absolute bottom-0 right-0 bg-gray-900 opacity-80 px-2 rounded-tl-lg ">
          {price ? price : '?'} ETH per NFT
        </span>
      </div>
      <div className="relative flex flex-col px-4 py-4 bg-gradient-to-tr from-dmss-dark-black to-dmss-dark">
        <div className="flex flex-col justify-between items-center space-y-4">
          {freeMintLeft > 0 && !usePreSale ? (
            <div className="text-xl">
              {freeMintLeft} free NFT {freeMintLeft > 1 ? 's' : ''}
            </div>
          ) : (
            <div className="flex w-full justify-between items-center">
              <button
                aria-label="Decrement Mint Amount by 1"
                className="p-1 md:p-2 transition-colors flex items-center justify-center rounded-full text-lg font-bold border border-white bg-white bg-opacity-0 hover:bg-opacity-10"
                onClick={decrement}
              >
                <AiOutlineMinus />
              </button>
              <div className="w-28 cursor-default text-center font-extrabold text-xl md:text-2xl">
                {quantity}
              </div>
              <button
                aria-label="Increment Mint Amount by 1"
                className="p-1 md:p-2 transition-colors flex items-center justify-center rounded-full text-lg font-bold border border-white bg-white bg-opacity-0 hover:bg-opacity-10"
                onClick={increment}
              >
                <AiOutlinePlus />
              </button>
            </div>
          )}

          <button
            className={
              !account
                ? 'w-full self-center bg-gray-600 text-gray-200 py-2 cursor-not-allowed rounded-full text-xl font-extrabold tracking-widest'
                : 'w-full transition-colors self-center text-gray-50 hover:text-white bg-dmss-accent1-100 hover:bg-dmss-accent1-50 py-2 rounded-full text-xl font-extrabold tracking-widest'
            }
            // disabled={!account || soldOut}
            onClick={() => {
              // console.log(freeMintLeft > 0)
              // freeMintLeft > 0 && !usePreSale ? claim() : mint()
              mint()
            }}
          >
            {freeMintLeft > 0 && !usePreSale ? 'Claim' : 'Mint'}
          </button>
        </div>
      </div>

      {!account && !soldOut && (
        <div className="absolute -bottom-8 sm:-bottom-12 inset-x-0 flex items-center justify-center opacity-50">
          <InformationCircleIcon className="w-6 h-6 mr-2" />
          Connect your wallet to Mint
        </div>
      )}
    </div>
  )
}
