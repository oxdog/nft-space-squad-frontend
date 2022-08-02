import React from 'react'
import { FaInstagram, FaDiscord, FaTwitter, FaReddit, FaGlobe } from 'react-icons/fa'

interface FooterLinksProps {}

export const FooterLinks: React.FC<FooterLinksProps> = () => {
  return (
    <>
      <a
        aria-label="Link to NFT  Space Squad Instagram Page"
        href={process.env.NEXT_PUBLIC_HOMEPAGE_URL + '/home'}
        target="_blank"
        rel="noreferrer"
      >
        <FaGlobe className="w-6 h-6" />
      </a>
      <a
        aria-label="Link to NFT  Space Squad Instagram Page"
        href="http://instagram.com/NFTspacesquad"
        target="_blank"
        rel="noreferrer"
      >
        <FaInstagram className="w-6 h-6" />
      </a>

      <a
        aria-label="Link to NFT  Space Squad Twitter Page"
        href="https://twitter.com/NFTSquad"
        target="_blank"
        rel="noreferrer"
      >
        <FaTwitter className="w-6 h-6" />
      </a>

      <a
        aria-label="Link to NFT  Space Squad Sub-Reddit"
        href="https://www.reddit.com/user/NFTSS"
        target="_blank"
        rel="noreferrer"
      >
        <FaReddit className="w-6 h-6" />
      </a>

      <a
        aria-label="Link to join NFT  Space Squad Discord"
        href="https://discord.gg/BqRaA4aeV7"
        target="_blank"
        rel="noreferrer"
      >
        <FaDiscord className="w-6 h-6" />
      </a>
    </>
  )
}
