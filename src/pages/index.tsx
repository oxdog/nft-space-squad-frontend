import createWithApollo from '@utils/apollo/withApollo'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import Image from 'next/image'

const IndexPage = () => {
  const router = useRouter()
  useEffect(() => {
    if (router.isReady) {
      router.push('/presale')
    }
  }, [router])

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center">
      {/* Desktop */}
      <div className="hidden transform animate-pulse lg:flex">
        <Image
          src="/svg/LogoNoText.svg"
          alt="The DMSS Logo"
          width={500}
          height={500}
        />
      </div>

      {/* Tablet */}
      <div className="hidden transform animate-pulse md:flex lg:hidden">
        <Image
          src="/svg/LogoNoText.svg"
          alt="The DMSS Logo"
          width={300}
          height={300}
        />
      </div>

      {/* Mobile */}
      <div className="md:hidden transform animate-pulse">
        <Image
          src="/svg/LogoNoText.svg"
          alt="The DMSS Logo"
          width={200}
          height={200}
        />
      </div>
    </div>
  )
}

export default createWithApollo({ ssr: false })(IndexPage)
