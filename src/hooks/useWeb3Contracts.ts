import PillJSON from '@contracts/NFTEnlargeningPill.json'
import NFTJSON from '@contracts/NFT.json'
import DistributorJSON from '@contracts/Distributor.json'
import CompanyCardJSON from '@contracts/CompanyCard.json'
import PharmacyJSON from '@contracts/Pharmacy.json'
import PreSaleJSON from '@contracts/PreSale.json'
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import { PreSale } from 'src/types/generated'
import { NFTEnlargeningPill } from '../types/generated/NFTEnlargeningPill'
import { NFT } from '../types/generated/NFT'
import { Distributor } from '../types/generated/Distributor'
import { CompanyCard } from '../types/generated/CompanyCard'
import { Pharmacy } from '../types/generated/Pharmacy'

export const useWeb3Contracts = () => {
  const { library } = useWeb3React()

  if (!library) {
    return {
      signer: undefined,
      nft: undefined,
      pill: undefined,
      distributor: undefined,
      pharmacy: undefined,
    }
  }

  const signer = library.getSigner()

  if (!signer) {
    throw new Error('GetWeb3Connections: No Signer available')
  }

  // console.log('signer', signer)

  let nft: NFT | undefined = undefined
  let distributor: Distributor | undefined = undefined
  let presale: PreSale | undefined = undefined
  let pill: NFTEnlargeningPill | undefined = undefined
  let pharmacy: Pharmacy | undefined = undefined
  let emc: CompanyCard | undefined = undefined

  nft = ethers.ContractFactory.getContract(
    process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS,
    NFTJSON.abi,
    signer
  ) as NFT

  if (process.env.NEXT_PUBLIC_DISTRIBUTOR_CONTRACT_ADDRESS) {
    distributor = ethers.ContractFactory.getContract(
      process.env.NEXT_PUBLIC_DISTRIBUTOR_CONTRACT_ADDRESS,
      DistributorJSON.abi,
      signer
    ) as Distributor
  }

  if (process.env.NEXT_PUBLIC_PRESALE_CONTRACT_ADDRESS) {
    presale = ethers.ContractFactory.getContract(
      process.env.NEXT_PUBLIC_PRESALE_CONTRACT_ADDRESS,
      PreSaleJSON.abi,
      signer
    ) as PreSale
  }

  if (process.env.NEXT_PUBLIC_ECM_CONTRACT_ADDRESS) {
    emc = new ethers.Contract(
      process.env.NEXT_PUBLIC_ECM_CONTRACT_ADDRESS,
      CompanyCardJSON.abi,
      signer
    ) as CompanyCard
  }

  if (process.env.NEXT_PUBLIC_PILL_CONTRACT_ADDRESS) {
    pill = ethers.ContractFactory.getContract(
      process.env.NEXT_PUBLIC_PILL_CONTRACT_ADDRESS,
      PillJSON.abi,
      signer
    ) as NFTEnlargeningPill
  }

  if (process.env.NEXT_PUBLIC_PHARMACY_CONTRACT_ADDRESS) {
    pharmacy = ethers.ContractFactory.getContract(
      process.env.NEXT_PUBLIC_PHARMACY_CONTRACT_ADDRESS,
      PharmacyJSON.abi,
      signer
    ) as Pharmacy
  }
  return {
    signer,
    nft,
    pill,
    distributor,
    pharmacy,
    presale,
    emc,
  }
}
