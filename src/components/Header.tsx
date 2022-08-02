import { useAppDispatch, useAppSelector } from '@data/hooks'
import { resetOperations } from '@data/slices/operations'
import { resetUser } from '@data/slices/user'
import { Popover, Transition } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import { UserRejectedRequestError as UserRejectedRequestErrorFrame } from '@web3-react/frame-connector'
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from '@web3-react/injected-connector'
import { UserRejectedRequestError as UserRejectedRequestErrorWalletConnect } from '@web3-react/walletconnect-connector'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { Fragment } from 'react'
import { HiBell, HiMenuAlt3 } from 'react-icons/hi'
import { FooterLinks } from './FooterLinks'

interface HeaderProps {
  openWalletModal: () => void
  activeTab: string
}

export const Header: React.FC<HeaderProps> = ({ activeTab, openWalletModal }) => {
  const dispatch = useAppDispatch()
  const router = useRouter()

  const user = useAppSelector((state) => state.user.user)
  const cockpitIndicator = useAppSelector((state) => state.OPPool.cockpitIndicator)

  const { account, deactivate, error, setError } = useWeb3React()

  const inactiveClass =
    'transition-colors text-xl cursor-pointer border-b-4 hover:border-white border-transparent hover:bg-white hover:bg-opacity-5 px-4 py-4 lg:py-2 font-extrabold'
  const activeClass =
    'transition-colors text-xl border-b-4 border-dmss-accent1-100 bg-white bg-opacity-10 cursor-pointer px-4 py-4 lg:py-2 font-extrabold'

  const PingIndicator: React.FC<{}> = () => {
    return cockpitIndicator ? (
      <div className="relative">
        <HiBell className="absolute h-5 w-5 text-dmss-accent2-100 animate-pulse" />
        <HiBell className="absolute h-5 w-5 text-dmss-accent2-100 animate-ping" />
      </div>
    ) : (
      <></>
    )
  }

  const displayAccount = () =>
    account
      ? account.substring(0, 5) + '...' + account.substring(account.length - 4)
      : ''

  const getErrorMessage = (error: Error) => {
    if (error instanceof NoEthereumProviderError) {
      return 'No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.'
    } else if (error instanceof UnsupportedChainIdError) {
      return `You're connected to an unsupported network. Please switch to ${
        process.env.NEXT_PUBLIC_DEPLOYED_NETWORK === 'MAINNET'
          ? 'Ethereum Mainnet'
          : 'Rinkeby Testnet'
      }`
    } else if (
      error instanceof UserRejectedRequestErrorInjected ||
      error instanceof UserRejectedRequestErrorWalletConnect ||
      error instanceof UserRejectedRequestErrorFrame
    ) {
      return 'Please authorize this website to access your Ethereum account.'
    } else {
      console.error(error)
      return 'An unknown error occurred. Check the console for more details.'
    }
  }

  const disconnect = () => {
    dispatch(resetUser())
    dispatch(resetOperations())
    deactivate()
  }

  return (
    <Popover className="absolute inset-x-0 bg-black bg-opacity-50 z-50">
      {({ close: closePanel }) => (
        <>
          <div className="relative flex justify-between items-center px-4 py-3 sm:py-6 sm:px-6 lg:justify-start space-x-4 xl:space-x-4">
            <div>
              {/* Desktop Logo */}
              <a
                href={process.env.NEXT_PUBLIC_HOMEPAGE_URL + '/home'}
                className="hidden sm:flex"
              >
                {/* <Image src="/svg/Logo.svg" alt="DMSS Logo" width={380} height={80} /> */}
                <Image
                  src="/svg/Logo.svg"
                  alt="DMSS Logo"
                  width={1244 / 5}
                  height={335 / 5}
                />
              </a>

              {/* Mobile Logo */}
              <a
                href={process.env.NEXT_PUBLIC_HOMEPAGE_URL + '/home'}
                className="flex sm:hidden"
              >
                <Image
                  src="/svg/LogoNoText.svg"
                  alt="DMSS Logo"
                  width={322 / 6}
                  height={334 / 6}
                />
              </a>
            </div>

            <div className="-mr-2 -my-2 lg:hidden">
              {/* <Popover.Button className="bg-gray-50 rounded-md p-2 inline-flex items-center justify-center text-dmss-dark-black hover:text-gray-800 hover:bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-dmss-accent1-100"> */}
              <Popover.Button className="relative bg-white bg-opacity-10 border border-white focus:border-transparent rounded-md p-2 inline-flex items-center justify-center text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-dmss-accent1-100">
                <span className="sr-only">Open menu</span>
                <HiMenuAlt3 className="relative h-8 w-8" aria-hidden="true" />
                <div className="absolute -left-2 bottom-3">
                  <PingIndicator />
                </div>
              </Popover.Button>
            </div>

            <div className="hidden lg:flex flex-grow md:items-center md:justify-between">
              <Popover.Group as="nav" className="flex space-x-6 xl:space-x-10">
                {account && (
                  <button
                    className={
                      (activeTab == '/cockpit' ? activeClass : inactiveClass) +
                      ' relative'
                    }
                    onClick={() => router.push('cockpit')}
                  >
                    My Cockpit
                    <div className="absolute top-2 right-2">
                      <PingIndicator />
                    </div>
                  </button>
                )}

                {/* <button
                  className={activeTab == '/mint' ? activeClass : inactiveClass}
                  onClick={() => router.push('mint')}
                >
                  Buy a 
                </button> */}
                <button
                  className={activeTab == '/freemint' ? activeClass : inactiveClass}
                  onClick={() => router.push('freemint')}
                >
                  FreeMint
                </button>

                <button
                  className={activeTab == '/pharmacy' ? activeClass : inactiveClass}
                  onClick={() => router.push('pharmacy')}
                >
                  Pharmacy
                </button>

                <button
                  className={
                    activeTab == '/arcaderoom' ? activeClass : inactiveClass
                  }
                  onClick={() => router.push('arcaderoom')}
                >
                  Arcade
                </button>
              </Popover.Group>

              {/* Connect Button */}
              <div className="hidden lg:flex whitespace-nowrap items-center md:ml-12">
                {!account ? (
                  <button
                    className="py-2 px-4 transition-colors bg-dmss-accent2-100 hover:bg-dmss-accent2-50 font-extrabold shadow-lg rounded-full"
                    onClick={() => {
                      openWalletModal()
                    }}
                  >
                    Connect Wallet
                  </button>
                ) : (
                  <div className="space-y-2 flex flex-col">
                    <span className="pr-2 opacity-80 whitespace-nowrap">
                      Connected {displayAccount()}
                    </span>
                    <button
                      className="w-full transition-colors rounded-full px-4 border bg-white hover:bg-opacity-10 bg-opacity-5 backdrop-blur-sm"
                      onClick={() => disconnect()}
                    >
                      Disconnect
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Transition
            as={Fragment}
            enter="duration-200 ease-out"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="duration-100 ease-in"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Popover.Panel
              focus
              className="absolute top-0 inset-x-0 transition transform origin-top-right lg:hidden z-50"
            >
              <div className="relative rounded-lg shadow-lg ring-opacity-5 bg-dmss-dark-black divide-y-2 divide-gray-50 z-40">
                <div className="pt-5 pb-6 px-5">
                  <div className="flex items-center justify-between -px-2">
                    <div className="flex items-center space-x-2">
                      {/* <button
                        onClick={() => router.push('/pharmacy')}
                        className="flex flex-row space-x-2 justify-end font-extrabold bg-white bg-opacity-10 rounded-md p-2 text-white"
                      >
                        <span className="text-xl">💊</span>
                        <span className="text-lg">x</span>
                        <span className="text-xl">
                          {user
                            ? user.pillIds.length - user.blockedPillIds.length
                            : '?'}
                        </span>
                      </button> */}

                      <button
                        className="flex flex-row space-x-2 justify-end font-extrabold bg-white bg-opacity-10 rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-dmss-accent1-100"
                        onClick={() => router.push('/cockpit')}
                      >
                        <span className="text-xl">🍆</span>
                        <span className="text-lg">x</span>
                        <span className="text-xl">
                          {user
                            ? user.pillIds.length - user.blockedPillIds.length
                            : '?'}
                        </span>
                      </button>

                      {user && user.membershipCount > 0 && (
                        <button
                          className="flex flex-row space-x-2 justify-end font-extrabold bg-white bg-opacity-10 rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-dmss-accent1-100"
                          onClick={() => router.push('/cockpit')}
                        >
                          <span className="text-xl text-dmss-accent2-50">M</span>
                          <span className="text-lg">x</span>
                          <span className="text-xl">
                            {user ? user.membershipCount : '?'}
                          </span>
                        </button>
                      )}
                    </div>

                    <Popover.Button className="bg-white bg-opacity-10 border border-white focus:border-transparent rounded-md p-2 inline-flex items-center justify-center text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-dmss-accent1-100">
                      <span className="sr-only">Close menu</span>
                      <XIcon className="h-6 w-6" aria-hidden="true" />
                    </Popover.Button>
                  </div>
                  <div className="mt-6">
                    <nav className="grid gap-4">
                      {account && (
                        <button
                          className={
                            activeTab == '/cockpit' ? activeClass : inactiveClass
                          }
                          onClick={() => router.push('cockpit')}
                        >
                          <span className="relative">
                            My Cockpit
                            <div className="absolute -right-2 top-0.5">
                              <PingIndicator />
                            </div>
                          </span>
                        </button>
                      )}

                      {/* <button
                        className={
                          activeTab == '/mint' ? activeClass : inactiveClass
                        }
                        onClick={() => router.push('mint')}
                      >
                        Buy a 
                      </button> */}
                      <button
                        className={
                          activeTab == '/freemint' ? activeClass : inactiveClass
                        }
                        onClick={() => router.push('freemint')}
                      >
                        FreeMint
                      </button>

                      <button
                        className={
                          activeTab == '/pharmacy' ? activeClass : inactiveClass
                        }
                        onClick={() => router.push('pharmacy')}
                      >
                        Pharmacy
                      </button>

                      <button
                        className={
                          activeTab == '/arcaderoom' ? activeClass : inactiveClass
                        }
                        onClick={() => router.push('arcaderoom')}
                      >
                        Arcade
                      </button>
                    </nav>
                  </div>
                </div>
                <div className="py-8 px-5 space-y-8">
                  <div className="items-center w-full">
                    {!account ? (
                      <button
                        className="py-2 px-4 w-full transition-colors bg-dmss-accent2-100 hover:bg-dmss-accent2-50 font-extrabold shadow-lg rounded-full"
                        onClick={() => {
                          closePanel(this)
                          openWalletModal()
                        }}
                      >
                        Connect Wallet
                      </button>
                    ) : (
                      <div className="space-y-4 flex flex-col">
                        <span className="pr-2 opacity-80 w-full text-center whitespace-nowrap">
                          Connected with {displayAccount()}
                        </span>
                        <button
                          className="w-full transition-colors rounded-full px-4 py-2 border bg-white hover:bg-opacity-10 bg-opacity-5 backdrop-blur-sm"
                          onClick={() => disconnect()}
                        >
                          Disconnect
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-row items-center justify-around">
                    <FooterLinks />
                  </div>
                </div>
              </div>
            </Popover.Panel>
          </Transition>

          {error && (
            <div className="absolute inset-x-0 -bottom-22 px-4 lg:px-32 py-4 flex flex-col items-center space-y-2 bg-dmss-error bg-opacity-80 z-10">
              <span>{getErrorMessage(error)}</span>
              <button
                className="w-min rounded-full px-4 border border-white hover:bg-white hover:bg-opacity-20"
                onClick={() => {
                  // @ts-expect-error
                  setError(undefined)
                }}
              >
                close
              </button>
            </div>
          )}
        </>
      )}
    </Popover>
  )
}
