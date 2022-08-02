import React from 'react'
import Image from 'next/image'

interface OpenSeaButtonProps {}

export const OpenSeaButton: React.FC<OpenSeaButtonProps> = () => {
  return (
    <a
      className="px-4 md:px-8 transition-colors flex flex-row w-full justify-between items-center font-extrabold cursor-pointer border-2 bg-white hover:bg-opacity-20 bg-opacity-10 backdrop-blur-sm py-2 rounded-full text-lg md:text-xl"
      href={process.env.NEXT_PUBLIC_OPENSEA_COLLECTION_URL}
      target="_blank"
      rel="noreferrer"
    >
      <Image src="/svg/opensea.svg" height={30} width={30} alt="OpenSea Logo" />
      <span className="px-4">Trade on OpenSea</span>
      <Image src="/svg/opensea.svg" height={30} width={30} alt="OpenSea Logo" />
    </a>
  )
}
