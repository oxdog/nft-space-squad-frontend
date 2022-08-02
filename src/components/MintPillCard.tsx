import {
  manageOperationInPool,
  Operation,
  OPStatus,
  OPType,
  removeOperation,
  setOperation,
} from '@data/slices/operations'
import { refreshPills } from '@data/slices/user'
import { InformationCircleIcon } from '@heroicons/react/solid'
import { useWeb3Contracts } from '@hooks/useWeb3Contracts'
import { delay } from '@utils/misc/delay'
import { useWeb3React } from '@web3-react/core'
import React, { useState } from 'react'
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai'
import { v4 as uuidv4 } from 'uuid'
import { useAppDispatch } from '../data/hooks'

interface MintPillCardProps {
  price: string | undefined
  soldOut: boolean
  pillClaim: number
}

export const MintPillCard: React.FC<MintPillCardProps> = ({
  price,
  soldOut,
  pillClaim,
}) => {
  const MINT_LIMIT = 20

  const dispatch = useAppDispatch()
  const { pharmacy, pill } = useWeb3Contracts()
  const { account, connector } = useWeb3React()

  const [quantity, setQuantity] = useState<number>(1)

  const increment = () => quantity < MINT_LIMIT && setQuantity(quantity + 1)
  const decrement = () => quantity > 1 && setQuantity(quantity - 1)

  const purchasePill = async () => {
    try {
      if (!pharmacy || !account || !pill || !connector) {
        throw new Error()
      }

      const price = await pharmacy.price()
      const result = await pharmacy.purchasePills(quantity, {
        value: price.mul(quantity),
        gasLimit: 800000,
      })

      const data = {
        type: OPType.PILL_PURCHASE,
        description: `Issuing ${quantity} Enlargement Pill${
          quantity > 1 ? 's' : ''
        }`,
      }

      dispatch(manageOperationInPool({ result, data }))

      const recipe = await result.wait()

      if (recipe.status === 1) {
        dispatch(refreshPills({ address: account, pill }))
      }
    } catch (error: any) {
      if (error.code === 4001) {
        const operation: Operation = {
          id: uuidv4(),
          status: OPStatus.FAILED,
          hash: undefined,
          type: OPType.MINT,
          description: `Cancelled Enlargement Pill purchase`,
        }

        dispatch(setOperation(operation))
        await delay(5000)
        dispatch(removeOperation(operation.id))
      }
    }
  }

  const claimPill = async () => {
    try {
      if (!pharmacy || !account || !pill || !connector) {
        throw new Error()
      }

      const result = await pharmacy.claimFreePills()

      const data = {
        type: OPType.PILL_PURCHASE,
        description: `Claiming ${pillClaim} Enlargement Pill${
          pillClaim > 1 ? 's' : ''
        }`,
      }

      dispatch(manageOperationInPool({ result, data }))

      const recipe = await result.wait()

      if (recipe.status === 1) {
        dispatch(refreshPills({ address: account, pill }))
      }
    } catch (error: any) {
      if (error.code === 4001) {
        const operation: Operation = {
          id: uuidv4(),
          status: OPStatus.FAILED,
          hash: undefined,
          type: OPType.MINT,
          description: `Cancelled claiming Enlargement Pill`,
        }

        dispatch(setOperation(operation))
        await delay(5000)
        dispatch(removeOperation(operation.id))
      }
    }
  }

  const drawSoldOut = () => (
    <div className="absolute cursor-default inset-0 flex items-center justify-center bg-dmss-dark bg-opacity-50 whitespace-nowrap rounded-lg z-10">
      <div className="text-8xl mb-8 font-extrabold text-dmss-error border-8 border-dmss-error shadow-lg bg-gradient-to-tr from-dmss-dark-black to-dmss-dark transform rotate-12 rounded-lg p-8">
        Sold out!
      </div>
    </div>
  )

  return (
    <div className="relative flex flex-col w-64 md:w-72 rounded-lg border-b-4 border-dmss-accent1-100 shadow-2xl shadow-cyan-300">
      {soldOut && drawSoldOut()}
      <div className="relative py-24 bg-white bg-opacity-20 backdrop-blur-sm rounded-t-lg flex items-center justify-center flex-grow">
        <div className="text-5xl md:text-7xl">💊</div>
        {/* "Add loading placeholder" */}
        {/* <Image
          src="/png/Dep.png"
          alt="DMSS Logo"
          width={664 / 8}
          height={1020 / 8}
        /> */}
        <span className="absolute bottom-2 right-4 opacity-60">
          {price ? price : '?'} ETH per Pill
        </span>
      </div>
      <div className="relative flex flex-col px-4 py-4 bg-gradient-to-tr from-dmss-dark-black to-dmss-dark">
        <div className="flex flex-col justify-between items-center space-y-4">
          {pillClaim > 0 ? (
            <div className="text-xl">
              {pillClaim} free Pill{pillClaim > 1 ? 's' : ''}
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
            disabled={!account || soldOut}
            onClick={() => (pillClaim > 0 ? claimPill() : purchasePill())}
          >
            {pillClaim > 0 ? 'Claim' : 'Mint'}
          </button>
        </div>
      </div>

      {!account && !soldOut && (
        <div className="absolute -bottom-12 inset-x-0 flex items-center justify-center opacity-50 whitespace-nowrap">
          <InformationCircleIcon className="w-6 h-6 mr-2" />
          Connect your wallet to Mint
        </div>
      )}
    </div>
  )
}
