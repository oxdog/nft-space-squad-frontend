import PillJSON from '@contracts/NFTEnlargeningPill.json'
import NFTJSON from '@contracts/NFT.json'
import DistributorJSON from '@contracts/Distributor.json'
import PharmacyJSON from '@contracts/Pharmacy.json'
import PreSaleJSON from '@contracts/PreSale.json'
import { ExternalProvider } from '@ethersproject/providers'
import { ethers } from 'ethers'
import { NFTEnlargeningPill } from '../types/generated/NFTEnlargeningPill'
import { NFT } from '../types/generated/NFT'
import { Distributor } from '../types/generated/Distributor'
import { Pharmacy } from '../types/generated/Pharmacy'
import { PreSale } from '../types/generated/PreSale'

export const getWeb3Connections = () => {
  const provider = new ethers.providers.Web3Provider(
    window.ethereum as unknown as ExternalProvider
  )

  const signer = provider.getSigner()
  let pharmacy: Pharmacy | undefined = undefined
  let pill: NFTEnlargeningPill | undefined = undefined
  let distributor: Distributor | undefined = undefined
  let presale: PreSale | undefined = undefined

  if (!signer) {
    throw new Error('GetWeb3Connections: No Signer available')
  }

  const nft = ethers.ContractFactory.getContract(
    process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS,
    NFTJSON.abi,
    signer
  ) as NFT

  if (process.env.NEXT_PUBLIC_PRESALE_CONTRACT_ADDRESS) {
    presale = ethers.ContractFactory.getContract(
      process.env.NEXT_PUBLIC_PRESALE_CONTRACT_ADDRESS,
      PreSaleJSON.abi,
      signer
    ) as PreSale
  }

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
      PillJSON.abi,
      provider
    ) as NFTEnlargeningPill
  }

  return {
    provider,
    signer,
    nft,
    pill,
    distributor,
    pharmacy,
    presale,
  }
}
