import { useAppDispatch, useAppSelector } from '@data/hooks'
import { resetOperations } from '@data/slices/operations'
import { initSaleData } from '@data/slices/saleData'
import { loadUser, resetUser } from '@data/slices/user'
import { useWeb3Contracts } from '@hooks/useWeb3Contracts'
import { useWeb3React } from '@web3-react/core'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { CookieConsent } from './CookieConsent'
import { FooterLinks } from './FooterLinks'
import { Header } from './Header'
import { LoadingIndicator } from './LoadingIndicator'
import { MulitWalletModal } from './MulitWalletModal'
import { OperationStack } from './OperationStack'
import { Wrapper, WrapperVariant } from './Wrapper'

interface LayoutProps {
  variant?: WrapperVariant
  showNav?: boolean
}

export const Layout: React.FC<LayoutProps> = ({ children, variant }) => {
  const dispatch = useAppDispatch()
  const router = useRouter()

  const { account, connector } = useWeb3React()
  const { nft, pill, distributor, pharmacy, emc } = useWeb3Contracts()

  const loading = useAppSelector((state) => state.user.loading)
  const loadingSaleData = useAppSelector((state) => state.saleData.loading)

  const [activeTab, setActiveTab] = useState<string>('/presale')

  const [initDone, setInitDone] = useState<boolean>(false)
  const [showWalletModal, setShowWalletModal] = useState<boolean>(false)

  const [provider, setProvider] = useState<any>(false)
  const [isProviderSetup, setIsProviderSetup] = useState<any>(false)

  useEffect(() => {
    setActiveTab(router.pathname)
  }, [router.pathname])

  // Auto Load & remove provider
  useEffect(() => {
    const setupProvider = async () => {
      if (connector && !provider) {
        const provider = await connector.getProvider()
        setProvider(provider)
      } else if (!connector && provider) {
        setProvider(undefined)
      }
    }

    setupProvider()
  }, [connector, provider])

  // Loading public sale data
  useEffect(() => {
    if (!initDone) {
      dispatch(initSaleData())
      setInitDone(true)
    }
  }, [dispatch, initDone])

  // Adding relevant listeners
  useEffect(() => {
    if (provider && !isProviderSetup) {
      triggerLoadUser()

      provider.on('accountsChanged', handleAccountsChanged)
      provider.on('chainChanged', handleChainChanged)
      provider.on('disconnect', handleDisconnect)

      setIsProviderSetup(true)
    } else if (!provider && isProviderSetup) {
      setIsProviderSetup(false)
    }

    return () => {
      if (provider) {
        provider.removeListener('accountsChanged', handleAccountsChanged)
        provider.removeListener('chainChanged', handleChainChanged)
        provider.removeListener('disconnect', handleDisconnect)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, provider])

  const triggerLoadUser = () => {
    if (account && nft) {
      dispatch(loadUser({ address: account, nft, pill, distributor, pharmacy, emc }))
    }
  }

  const handleAccountsChanged = (accounts: string[]) => {
    // info: disconnect triggers event with accounts = []
    dispatch(resetUser())
    dispatch(resetOperations())

    if (accounts.length > 0 && account && nft && pill) {
      triggerLoadUser()
    }
  }

  const handleChainChanged = (chainId: number) => {
    console.log('chainChanged', chainId)
    // show error
  }

  const handleDisconnect = () => {
    dispatch(resetUser())
    dispatch(resetOperations())
  }

  const renderBackground = () => {
    switch (activeTab) {
      case '/mint':
        return (
          <div className="absolute inset-0 opacity-80 bg-no-repeat bg-cover bg-center bg-page-mint-mobile md:bg-page-mint" />
        )
      case '/pharmacy':
        return (
          <div className="absolute inset-0 opacity-80 bg-no-repeat bg-cover bg-center bg-page-pharmacy" />
        )
      case '/arcaderoom':
        return (
          <div className="absolute inset-0 opacity-80 bg-no-repeat bg-cover bg-center bg-page-arcaderoom" />
        )
      case '/cockpit':
        return (
          <div className="absolute inset-0 opacity-80 bg-no-repeat bg-cover bg-center bg-page-cockpit" />
        )

      default:
        return (
          <div className="absolute inset-0 opacity-80 bg-no-repeat bg-cover bg-center bg-page-mint-mobile md:bg-page-mint" />
        )
    }
  }

  return (
    <div className={`relative w-screen h-screen max-h-screen `}>
      {showWalletModal && (
        <MulitWalletModal closeModal={() => setShowWalletModal(false)} />
      )}

      {renderBackground()}

      <Header
        openWalletModal={() => setShowWalletModal(true)}
        activeTab={activeTab}
      />

      <Wrapper variant={variant}>{children}</Wrapper>
      {(loading || loadingSaleData) && <LoadingIndicator />}
      <OperationStack />

      <div className="hidden lg:flex absolute bottom-8 right-8 items-center space-x-6">
        <FooterLinks />
      </div>

      <CookieConsent />
    </div>
  )
}
