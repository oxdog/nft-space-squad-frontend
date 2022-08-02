import { useAppDispatch, useAppSelector } from '@data/hooks'
import {
  manageOperationInPool,
  Operation,
  OPStatus,
  OPType,
  removeOperation,
  setOperation,
} from '@data/slices/operations'
import {
  blockPillId,
  NFTMeta,
  refreshNFT,
  refreshPills,
  unlockPillId,
} from '@data/slices/user'
import { XIcon } from '@heroicons/react/solid'
import { useWeb3Contracts } from '@hooks/useWeb3Contracts'
import { delay } from '@utils/misc/delay'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

interface GrowOverlayProps {
  closeOverlay: () => void
  tokenId: number
}

export const GrowOverlay: React.FC<GrowOverlayProps> = ({
  closeOverlay,
  tokenId,
}) => {
  const router = useRouter()

  const { pill, nft } = useWeb3Contracts()

  const dispatch = useAppDispatch()
  const NFTs = useAppSelector((state) => state.user.NFTs)
  const user = useAppSelector((state) => state.user.user)

  const [pillsAvailable, setPillsAvailable] = useState<boolean>(true)
  const [txInitiated, setTxInitiated] = useState<boolean>(false)
  const [NFT, setNFT] = useState<NFTMeta>()

  useEffect(() => {
    if (NFTs) {
      setNFT(NFTs.filter((d) => d.tokenId == tokenId)[0])
    }
  }, [NFTs, tokenId])

  useEffect(() => {
    if (user) {
      const isPillAvailable = user.pillIds.length > user.blockedPillIds.length
      const userHasPills = user.pillIds.length > 0

      console.log(userHasPills, isPillAvailable)

      setPillsAvailable(userHasPills && isPillAvailable)
    }
  }, [user])

  useEffect(() => console.log('pillsAvailable', pillsAvailable), [pillsAvailable])

  const enlargeNFT = async () => {
    setTxInitiated(true)

    let pillId

    try {
      if (!pill || !user || !nft) {
        throw new Error()
      }

      const allIds = user.pillIds

      if (allIds.length == 0) {
        throw new Error('ENLARGE_PILL: No pills to use')
      }

      const filteredIds = allIds.filter(
        (id: number) => !user?.blockedPillIds.includes(id)
      )

      if (filteredIds.length == 0) {
        throw new Error('ENLARGE_PILL: No pills left to use')
      }

      pillId = filteredIds[0]

      dispatch(blockPillId(pillId))

      const result = await pill.use(pillId, tokenId)

      const data = {
        type: OPType.PILL_GROW,
        description: `Enlargening NFT  #${tokenId}`,
      }

      dispatch(manageOperationInPool({ result, data }))

      const recipe = await result.wait()

      if (recipe.status == 1) {
        dispatch(unlockPillId(pillId))
        dispatch(refreshNFT({ nft, tokenId }))
        dispatch(refreshPills({ pill, address: user.address }))
      } else {
        dispatch(unlockPillId(pillId))
      }
    } catch (error: any) {
      if (pillId) {
        dispatch(unlockPillId(pillId))
      }

      if (error.code === 4001) {
        const operation: Operation = {
          id: uuidv4(),
          status: OPStatus.FAILED,
          hash: undefined,
          type: OPType.MINT,
          description: `Cancelled Enlargening NFT  #${tokenId}`,
        }

        dispatch(setOperation(operation))
        closeOverlay()
        await delay(5000)
        dispatch(removeOperation(operation.id))
      }
    }
  }

  return (
    <div className="absolute inset-0 bg-gray-900 z-50 bg-opacity-50 backdrop-blur-sm flex">
      <div className="absolute inset-0 z-0" onClick={closeOverlay} />

      <div className="relative m-auto w-96 pt-12 pb-8 px-4 rounded-lg flex flex-col items-center border-4 border-dmss-accent1-100 bg-gradient-to-bl from-dmss-bright to-dmss-dark z-30 shadow-2xl shadow-cyan-300">
        <XIcon
          className="absolute top-2 right-2 w-10 h-10 p-2 rounded-full cursor-pointer hover:bg-white hover:bg-opacity-5"
          onClick={closeOverlay}
        />

        {/* Image */}
        <div className="relative h-72 w-72 rounded-lg shadow-lg bg-white bg-opacity-5 z-0">
          <div className="absolute inset-0 rounded-lg z-0 overflow-hidden">
            <Image
              src={
                process.env.NEXT_PUBLIC_IPFS_NODE +
                NFT?.image.replace('ipfs://', '')
              }
              alt={`Picture of NFT  #${tokenId}`}
              width={500}
              height={500}
            />
          </div>

          <span className="absolute -bottom-8 inset-x-0 text-center font-extrabold text-lg">
            ID #{tokenId}
          </span>
        </div>

        {/* <div className="space-x-4">
          <span className="font-extrabold text-4xl">Size</span>
          <span className="font-extrabold text-5xl">{NFT ? NFT.size : '?'}</span>
        </div> */}

        {txInitiated ? (
          <div className="text-center font-extrabold pb-8 w-72 mt-20">
            Confirm the transaction in your wallet to complete the process
          </div>
        ) : (
          <div className="space-y-4 w-72">
            {user && pillsAvailable ? (
              <button
                className=" mt-20 px-8 w-full font-extrabold bg-gradient-to-tr from-dmss-accent1-100 hover:from-dmss-accent1-50 to-dmss-accent1-50 shadow-lg py-2 rounded-full text-lg"
                onClick={() => enlargeNFT()}
              >
                Grow
              </button>
            ) : (
              <>
                <div className="font-extrabold text-center pb-4 w-full mt-12">
                  You need NFT Enlargening Pills (DEP) to grow your NFT!
                </div>
                <button
                  className="px-8 transition-colors font-extrabold border-2 w-full bg-white hover:bg-opacity-20 bg-opacity-10 backdrop-blur-sm py-2 rounded-full text-xl"
                  onClick={() => router.push('/pharmacy')}
                >
                  💊 Get more Pills 💊
                </button>
              </>
            )}

            <button
              className="px-8 font-extrabold w-full border-2 bg-white hover:bg-opacity-20 bg-opacity-10 backdrop-blur-sm py-2 rounded-full text-xl"
              onClick={closeOverlay}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
