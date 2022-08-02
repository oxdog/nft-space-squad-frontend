import NFTEnlargeningPillJSON from '@contracts/NFTEnlargeningPill.json'
import NFTJSON from '@contracts/NFT.json'
import DistributorJSON from '@contracts/Distributor.json'
import PharmacyJSON from '@contracts/Pharmacy.json'
import { BigNumber, ethers, utils } from 'ethers'
import { NextApiRequest, NextApiResponse } from 'next'
import { NFTEnlargeningPill } from '../../types/generated/NFTEnlargeningPill'
import { NFT } from '../../types/generated/NFT'
import { Distributor } from '../../types/generated/Distributor'
import { Pharmacy } from '../../types/generated/Pharmacy'

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  try {
    const provider = new ethers.providers.JsonRpcProvider(
      // process.env.NODE_ENV === 'production'
      // ? process.env.ALCHEMY_URL_MAINNET
      process.env.ALCHEMY_URL_MAINNET
      // : process.env.ALCHEMY_DEV_URL_RINKEBY
    )

    let pharmacy: Pharmacy | undefined = undefined
    let pill: NFTEnlargeningPill | undefined = undefined
    let distributor: Distributor | undefined = undefined

    const nft = new ethers.Contract(
      process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS,
      NFTJSON.abi,
      provider
    ) as NFT

    if (process.env.NEXT_PUBLIC_DISTRIBUTOR_CONTRACT_ADDRESS) {
      distributor = new ethers.Contract(
        process.env.NEXT_PUBLIC_DISTRIBUTOR_CONTRACT_ADDRESS,
        DistributorJSON.abi,
        provider
      ) as Distributor
    }

    if (process.env.NEXT_PUBLIC_PHARMACY_CONTRACT_ADDRESS) {
      pharmacy = new ethers.Contract(
        process.env.NEXT_PUBLIC_PHARMACY_CONTRACT_ADDRESS,
        PharmacyJSON.abi,
        provider
      ) as Pharmacy
    }

    if (process.env.NEXT_PUBLIC_PILL_CONTRACT_ADDRESS) {
      pill = new ethers.Contract(
        process.env.NEXT_PUBLIC_PILL_CONTRACT_ADDRESS,
        NFTEnlargeningPillJSON.abi,
        provider
      ) as NFTEnlargeningPill
    }

    const nftPrice = distributor
      ? await distributor.getCurrentItemPrice()
      : utils.parseEther('0.08')
    const pillPrice = pharmacy ? await pharmacy.price() : BigNumber.from(0)
    const pharmacyPaused = pharmacy ? await pharmacy.paused() : true
    const totalSupply = await nft.totalSupply()
    const collectionSize = distributor
      ? await distributor.collectionSize()
      : BigNumber.from(10000)
    const freeMintContingent = distributor
      ? await distributor.freeMintContingent()
      : BigNumber.from(0)
    const pillTotalSupply = pill ? await pill.totalSupply() : BigNumber.from(0)
    const pillSupplyCap = pharmacy ? await pharmacy.supplyCap() : BigNumber.from(0)

    const freeMintClaimDeadline = distributor
      ? await distributor.freeMintClaimDeadline()
      : BigNumber.from(0)

    let soldOut

    if (freeMintClaimDeadline.gt(Math.floor(Date.now() / 1000))) {
      soldOut = totalSupply.eq(collectionSize.sub(freeMintContingent))
    } else {
      soldOut = totalSupply.eq(collectionSize)
    }

    const pillSoldOut = pillTotalSupply.eq(pillSupplyCap)

    res.status(200).json({
      pharmacyIsOpen: !pharmacyPaused,
      nftPrice: ethers.utils.formatEther(nftPrice),
      pillPrice: ethers.utils.formatEther(pillPrice),
      soldOut,
      pillSoldOut,
      totalSupply: totalSupply.toNumber(),
    })
  } catch (e) {
    console.log(e)

    res
      .status(500)
      .json({ error: 'Contract Interaction encountered an error. Try again later.' })
  }
}
