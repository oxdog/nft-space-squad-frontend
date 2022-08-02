/* eslint-disable no-unused-vars */
import { Web3Provider } from '@ethersproject/providers'
import { XIcon } from '@heroicons/react/solid'
import {
  authereum,
  injected,
  lattice,
  ledger,
  portis,
  torus,
  trezor,
  walletconnect,
  walletlink,
} from '@utils/connectors'
import { useWeb3React } from '@web3-react/core'
import React from 'react'
import Image from 'next/image'
import { delay } from '@utils/misc/delay'

enum ConnectorNames {
  BrowserWallet = 'BrowserWallet',
  Network = 'Network',
  WalletConnect = 'WalletConnect',
  WalletLink = 'WalletLink',
  Ledger = 'Ledger',
  Trezor = 'Trezor',
  Lattice = 'Lattice',
  Frame = 'Frame',
  Authereum = 'Authereum',
  Fortmatic = 'Fortmatic',
  Magic = 'Magic',
  Portis = 'Portis',
  Torus = 'Torus',
}

// @ts-ignore
const connectorsByName: { [connectorName in ConnectorNames]: any } = {
  [ConnectorNames.BrowserWallet]: injected,
  [ConnectorNames.WalletConnect]: walletconnect,
  [ConnectorNames.WalletLink]: walletlink,
  [ConnectorNames.Portis]: portis,
  [ConnectorNames.Authereum]: authereum,
  [ConnectorNames.Torus]: torus,
  [ConnectorNames.Ledger]: ledger,
  [ConnectorNames.Trezor]: trezor,
  [ConnectorNames.Lattice]: lattice,
  // not working or api keys + payment
  // [ConnectorNames.Frame]: frame, // not opening
  // [ConnectorNames.Magic]: magic, // paid
  // [ConnectorNames.Fortmatic]: fortmatic, // paid
}

interface MulitWalletModalProps {
  closeModal: () => void
}

export const MulitWalletModal: React.FC<MulitWalletModalProps> = ({
  closeModal,
}) => {
  const { connector, activate, error, setError } = useWeb3React<Web3Provider>()

  const [activatingConnector, setActivatingConnector] = React.useState<any>()

  const handleConnector = async (assignedConnector: any) => {
    setActivatingConnector(assignedConnector)

    let skipPause = false

    await activate(assignedConnector, (error) => {
      if (error) {
        // WalletConnect Modal not re-opening fix
        if (assignedConnector.walletConnectProvider) {
          assignedConnector.walletConnectProvider = undefined
        }

        setActivatingConnector(undefined)
        setError(error)

        skipPause = true
      }
    })

    if (!skipPause) {
      await delay(500)
    }

    closeModal()
  }

  return (
    <div className="absolute inset-0 pt-32 pb-12 bg-gray-900 z-50 bg-opacity-50 backdrop-blur-sm flex flex-col items-center justify-start lg:justify-center">
      <div className="absolute inset-0" onClick={closeModal} />

      <div className="relative h-full lg:h-min flex flex-col items-center justify-center bg-gradient-to-tr from-dmss-dark-black to-dmss-dark pt-8 pb-4 px-4 md:p-8 rounded-lg shadow-md z-10">
        <div className="absolute inset-x-0 top-4 px-4 flex flex-row w-full justify-between">
          <div className="font-extrabold opacity-60 cursor-default">
            Choose your preferred wallet
          </div>
          <XIcon className="w-6 h-6 cursor-pointer" onClick={closeModal} />
        </div>

        <div className="overflow-y-auto px-4 md:py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8 lg:mt-0">
            {Object.keys(connectorsByName).map((walletName) => {
              // @ts-ignore
              const assignedConnector = connectorsByName[walletName]
              const activating = assignedConnector === activatingConnector
              const connected = assignedConnector === connector
              const disabled = !!activatingConnector || connected || !!error

              return (
                <div
                  key={walletName}
                  onClick={() => handleConnector(assignedConnector)}
                  className={`transition-colors cursor-pointer shadow-lg py-2 md:py-4 mx-4 pl-1 pr-14 md:px-12 border-b-2 border-transparent rounded-lg flex flex-row md:flex-col items-center space-x-4 md:space-x-0 md:space-y-4  ${
                    connected
                      ? 'bg-white bg-opacity-5 border-green-500'
                      : activating
                      ? 'bg-white bg-opacity-5 border-yellow-500'
                      : `${
                          !disabled
                            ? 'hover:bg-white hover:bg-opacity-5 hover:border-white'
                            : 'opacity-50'
                        }`
                  }`}
                >
                  <div className="hidden md:flex items-center justify-center relative p-4 rounded-full shadow-md bg-white bg-opacity-10">
                    {activating && !connected && (
                      <div className="absolute -inset-2 border-t-4 border-b-4 border-yellow-500 rounded-full animate-spin"></div>
                    )}
                    <Image
                      src={`/svg/wallets/${walletName}.svg`}
                      alt={`Logo of ${walletName}`}
                      width={48}
                      height={48}
                    />
                  </div>

                  <div className="md:hidden relative p-2 md:p-4 rounded-full shadow-md bg-white bg-opacity-10 flex items-center justify-center">
                    {activating && !connected && (
                      <div className="absolute -inset-2 border-t-4 border-b-4 border-yellow-500 rounded-full animate-spin"></div>
                    )}
                    <Image
                      src={`/svg/wallets/${walletName}.svg`}
                      alt={`Logo of ${walletName}`}
                      width={24}
                      height={24}
                    />
                  </div>
                  <span className="font-extrabold">{walletName}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
