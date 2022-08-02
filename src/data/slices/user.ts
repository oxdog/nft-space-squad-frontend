// prettier-ignore
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { NFT } from '../../types/generated/NFT'
import { NFTEnlargeningPill } from '../../types/generated/NFTEnlargeningPill'
import { BigNumber } from 'ethers'
import { Pharmacy } from '../../types/generated/Pharmacy'
import { Distributor } from '../../types/generated/Distributor'
import { CompanyCard } from '../../types/generated/CompanyCard'
import { getWhitelist } from '@utils/getWhitelist'

type User = {
  address: string
  pillIds: number[]
  blockedPillIds: number[]
  NFTIds: number[]
  spotConfig: { whitelist: number; freeMint: number }
  whitelistLeft: number
  freeMintLeft: number
  pillClaim: number
  membershipCount: number
}

export type NFTMeta = {
  tokenId: number
  name: string
  size: number
  image: string
  description: string
  attributes: { trait_type: string; value: any }[]
}

interface UserState {
  user: User | undefined
  NFTs: NFTMeta[]
  loading: boolean
  loadingNFTData: boolean
  error: string[]
}

// Define the initial state using that type
const initialState: UserState = {
  user: undefined,
  NFTs: [],
  loading: false,
  loadingNFTData: false,
  error: [],
}

// eslint-disable-next-line no-unused-vars
const loadUser = createAsyncThunk(
  'user/loadUser',
  async (
    data: {
      address: string
      nft: NFT
      pill: NFTEnlargeningPill | undefined
      distributor: Distributor | undefined
      pharmacy: Pharmacy | undefined
      emc: CompanyCard | undefined
    },
    thunkAPI
  ) => {
    try {
      let user: User | undefined = undefined

      const whitelistData = getWhitelist()
      const { address, nft, pill, distributor, pharmacy, emc } = data

      const NFTBalance = await nft.balanceOf(address)
      const pillBalance = pill ? await pill.balanceOf(address) : BigNumber.from(0)
      const whitelistClaimed = distributor
        ? await distributor.whitelistClaimed(address)
        : BigNumber.from(10000)
      const freeMintClaimed = distributor
        ? await distributor.freeMintClaimed(address)
        : BigNumber.from(10000)
      const whitelist = whitelistData[address] ? whitelistData[address].whitelist : 0
      const freeMint = whitelistData[address] ? whitelistData[address].freeMint : 0
      const whitelistLeft = whitelist - whitelistClaimed.toNumber()
      const freeMintLeft = freeMint - freeMintClaimed.toNumber()
      const hasPillClaimed = pharmacy ? await pharmacy.claimRegistry(address) : true
      const membershipCount = emc ? (await emc.balanceOf(address)).toNumber() : 0

      let pillClaim = 0
      if (!hasPillClaimed) {
        pillClaim = (await nft.pcEligible(address)).toNumber()
      }

      let NFTIds: number[] = []
      let pillIds: number[] = []

      let NFTPromises: Promise<any>[] = []
      let pillPromises: Promise<any>[] = []

      for (let i = 0; i < NFTBalance.toNumber(); i++) {
        NFTPromises.push(
          new Promise((res, rej) => {
            nft
              .tokenOfOwnerByIndex(address, i)
              .then((result) => {
                NFTIds.push(result.toNumber())
                res(result)
              })
              .catch((error) => rej(error))
          })
        )
      }

      if (pill) {
        for (let i = 0; i < pillBalance.toNumber(); i++) {
          pillPromises.push(
            new Promise((res, rej) => {
              pill
                .tokenOfOwnerByIndex(address, i)
                .then((result) => {
                  pillIds.push(result.toNumber())
                  res(result)
                })
                .catch((error) => rej(error))
            })
          )
        }
      }

      await Promise.all(NFTPromises)
      await Promise.all(pillPromises)

      NFTIds.sort((a, b) => (a > b ? 1 : a == b ? 0 : -1))
      pillIds.sort((a, b) => (a > b ? 1 : a == b ? 0 : -1))

      thunkAPI.dispatch(loadNFTData({ nft, tokenIds: NFTIds }))

      user = {
        address,
        blockedPillIds: [],
        pillIds,
        NFTIds,
        spotConfig: { whitelist, freeMint },
        whitelistLeft,
        freeMintLeft,
        pillClaim,
        membershipCount,
      }

      return user
    } catch (e) {
      console.log('user/loadUser', e)
      throw new Error(`user/loadUser\n\n${e}`)
    }
  }
)

const loadNFTData = createAsyncThunk(
  'user/loadNFTData',
  async (data: { tokenIds: number[]; nft: NFT }) => {
    let loadingURLsPromises: Promise<any>[] = []
    let loadingJSONPromises: Promise<any>[] = []
    let metaDataUrls: { [key: number]: string } = {}
    let NFTs: NFTMeta[] = []

    const { nft, tokenIds } = data
    const isRevealed = await nft.revealed()

    if (!isRevealed) {
      tokenIds.forEach((tokenId) => {
        NFTs.push({
          tokenId,
          name: 'Unrevealed NFT ',
          size: 0,
          image: 'unrevealed',
          description: '',
          attributes: [
            { trait_type: 'Is it a NFT?', value: 'Yes' },
            { trait_type: 'Does it belong to the space squad?', value: 'Yes' },
          ],
        })
      })
    } else {
      try {
        let BATCH_SIZE = 5
        for (let i = 0; i < tokenIds.length; i++) {
          const tokenId = tokenIds[i]

          loadingURLsPromises.push(
            new Promise((res, rej) => {
              nft
                .tokenURI(tokenId)
                .then((result) => {
                  metaDataUrls[tokenId] = result.replace('ipfs://', '')
                  res(true)
                })
                .catch((error) => {
                  console.log('error', error)
                  rej(error)
                })
            })
          )

          if (loadingJSONPromises.length >= BATCH_SIZE) {
            console.log('Loading batch tokenuri', i)
            await Promise.all(loadingJSONPromises)
            loadingJSONPromises = []
          }
        }

        if (loadingURLsPromises.length > 0) {
          await Promise.all(loadingURLsPromises)
          loadingJSONPromises = []
        }

        for (let i = 0; i < tokenIds.length; i++) {
          const tokenId = tokenIds[i]

          loadingJSONPromises.push(
            new Promise((res, rej) => {
              axios
                .get(process.env.NEXT_PUBLIC_IPFS_NODE + metaDataUrls[tokenId])
                .then((result: any) => {
                  const { data } = result

                  const size = Number(
                    metaDataUrls[tokenId]
                      .replace(/\/\d*\.json/gim, '')
                      .substring(
                        metaDataUrls[tokenId].replace(/\/\d*\.json/gim, '').length -
                          1
                      )
                  )

                  NFTs.push({
                    tokenId,
                    name: data.name,
                    size,
                    image: data.image,
                    description: data.description,
                    attributes: data.attributes,
                  })

                  res(true)
                })
                .catch((error: any) => {
                  console.log('error', error)
                  rej(error)
                })
            })
          )

          if (loadingJSONPromises.length >= BATCH_SIZE) {
            console.log('Loading batch nft data', i)
            await Promise.all(loadingJSONPromises)
            loadingJSONPromises = []
          }
        }

        if (loadingURLsPromises.length > 0) {
          await Promise.all(loadingURLsPromises)
          loadingJSONPromises = []
        }
      } catch (e) {
        console.log(e)
        throw new Error(`user/loadNFTData\n\n${e}`)
      }
    }
    return NFTs
  }
)

const refreshNFT = createAsyncThunk(
  'user/refreshNFT',
  async (data: { tokenId: number; nft: NFT }) => {
    try {
      const { nft, tokenId } = data
      const size = await nft.getSize(tokenId)
      return { size: size.toNumber(), tokenId }
    } catch (e) {
      throw new Error(`user/refreshNFT\n\n${e}`)
    }
  }
)

const refreshPills = createAsyncThunk(
  'user/refreshPills',
  async (data: { address: string; pill: NFTEnlargeningPill }) => {
    try {
      let pillPromises: Promise<any>[] = []
      let pillIds: number[] = []

      const { pill, address } = data

      const pillBalance = await pill.balanceOf(address)

      for (let i = 0; i < pillBalance.toNumber(); i++) {
        pillPromises.push(
          new Promise((res, rej) => {
            pill
              .tokenOfOwnerByIndex(address, i)
              .then((result) => {
                pillIds.push(result.toNumber())
                res(result)
              })
              .catch((error) => rej(error))
          })
        )
      }

      await Promise.all(pillPromises)

      pillIds.sort((a, b) => (a > b ? 1 : a == b ? 0 : -1))

      return {
        pillIds,
      }
    } catch (e) {
      console.log(e)
      throw new Error(`user/refreshPills\n\n${e}`)
    }
  }
)

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetUser: (state) => {
      state.user = undefined
      state.NFTs = []
      state.loading = false
      state.loadingNFTData = false
      state.error = []
    },
    blockPillId: (state, action: PayloadAction<number>) => {
      if (state.user) {
        state.user.blockedPillIds.push(action.payload)
      }
    },
    unlockPillId: (state, action: PayloadAction<number>) => {
      if (state.user) {
        state.user.blockedPillIds = state.user.blockedPillIds.filter(
          (id) => id !== action.payload
        )
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadUser.fulfilled, (state, action) => {
      state.user = action.payload
      state.loading = false
      state.error = []
    })
    builder.addCase(loadUser.pending, (state) => {
      state.loading = true
    })
    builder.addCase(loadUser.rejected, (state) => {
      state.loading = false
      state.error.push('Loading user failed')
    })

    builder.addCase(loadNFTData.fulfilled, (state, action) => {
      if (action.payload) {
        state.NFTs = action.payload
      }
      state.loadingNFTData = false
    })
    builder.addCase(loadNFTData.pending, (state) => {
      state.loadingNFTData = true
    })
    builder.addCase(loadNFTData.rejected, (state) => {
      state.loadingNFTData = false
      state.error.push('Loading NFT failed')
    })

    builder.addCase(refreshNFT.fulfilled, (state, { payload }) => {
      state.NFTs = state.NFTs.map((dm) =>
        dm.tokenId === payload.tokenId
          ? {
              ...dm,
              size: payload.size,
            }
          : dm
      )

      state.loading = false
      state.error = []
    })
    builder.addCase(refreshNFT.pending, (state) => {
      state.loading = true
    })
    builder.addCase(refreshNFT.rejected, (state) => {
      state.loading = true
    })

    builder.addCase(refreshPills.fulfilled, (state, { payload }) => {
      if (state.user) {
        state.user = {
          ...state.user,
          pillIds: payload.pillIds,
        }
      }

      state.loading = false
      state.error = []
    })
    builder.addCase(refreshPills.pending, (state) => {
      state.loading = true
    })
    builder.addCase(refreshPills.rejected, (state) => {
      state.loading = true
    })
  },
})

export const { resetUser, blockPillId, unlockPillId } = userSlice.actions
export { loadUser, loadNFTData, refreshNFT, refreshPills }
export default userSlice.reducer
