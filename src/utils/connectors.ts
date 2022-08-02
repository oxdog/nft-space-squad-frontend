import { AuthereumConnector } from '@web3-react/authereum-connector'
import { FrameConnector } from '@web3-react/frame-connector'
import { InjectedConnector } from '@web3-react/injected-connector'
import { LatticeConnector } from '@web3-react/lattice-connector'
import { LedgerConnector } from '@web3-react/ledger-connector'
import { NetworkConnector } from '@web3-react/network-connector'
import { PortisConnector } from '@web3-react/portis-connector'
import { TorusConnector } from '@web3-react/torus-connector'
import { TrezorConnector } from '@web3-react/trezor-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'

const APP_NAME = 'DMSS - NFT  Space Squad'
const APP_LOGO_URL =
  'https://www.NFTspacesquad.com/wp-content/uploads/2022/01/logo.png'
const EMAIL = 'office@NFTspacesquad.com'
const CHAIN_ID = process.env.NEXT_PUBLIC_DEPLOYED_NETWORK == 'MAINNET' ? 1 : 4
const SUPPORTED_CHAIN_IDS =
  process.env.NEXT_PUBLIC_DEPLOYED_NETWORK == 'MAINNET' ? [1] : [4]
const RPC_URLS: { [chainId: number]: string } = {
  1: process.env.NEXT_PUBLIC_RPC_URL_1,
  4: process.env.NEXT_PUBLIC_RPC_URL_4,
}
const POLLING_INTERVAL = 12000

export const injected = new InjectedConnector({
  supportedChainIds: SUPPORTED_CHAIN_IDS,
})

export const network = new NetworkConnector({
  urls: RPC_URLS,
  defaultChainId: CHAIN_ID,
})

export const walletconnect = new WalletConnectConnector({
  rpc: RPC_URLS,
  chainId: CHAIN_ID,
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
})

export const walletlink = new WalletLinkConnector({
  url: RPC_URLS[CHAIN_ID],
  appName: APP_NAME,
  supportedChainIds: SUPPORTED_CHAIN_IDS,
  appLogoUrl: APP_LOGO_URL,
  darkMode: true,
})

export const ledger = new LedgerConnector({
  chainId: CHAIN_ID,
  url: RPC_URLS[CHAIN_ID],
  pollingInterval: POLLING_INTERVAL,
})

export const trezor = new TrezorConnector({
  chainId: CHAIN_ID,
  url: RPC_URLS[CHAIN_ID],
  pollingInterval: POLLING_INTERVAL,
  manifestEmail: EMAIL,
  manifestAppUrl: process.env.NEXT_PUBLIC_HOMEPAGE_URL,
})

export const lattice = new LatticeConnector({
  chainId: CHAIN_ID,
  appName: APP_NAME,
  url: RPC_URLS[CHAIN_ID],
})

export const frame = new FrameConnector({ supportedChainIds: [CHAIN_ID] })

export const authereum = new AuthereumConnector({ chainId: CHAIN_ID })

export const portis = new PortisConnector({
  dAppId: process.env.NEXT_PUBLIC_PORTIS_DAPP_ID,
  networks: SUPPORTED_CHAIN_IDS,
})

export const torus = new TorusConnector({ chainId: CHAIN_ID })
