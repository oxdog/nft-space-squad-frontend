import WhitelistJson from '../../public/whitelist.json'

type Whitelist = {
  [address: string]: {
    freeMint: number
    whitelist: number
  }
}

export const getWhitelist = () => WhitelistJson as Whitelist
