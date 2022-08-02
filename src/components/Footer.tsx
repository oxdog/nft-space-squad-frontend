import React from 'react'
import { CookieConsent } from './CookieConsent'
// import { AcademicCapIcon } from '@heroicons/react/solid'

interface FooterProps {}

type LinkEntry = {
  name: string
  href: string
  // eslint-disable-next-line
  icon?: (props: React.ComponentProps<'svg'>) => JSX.Element
}

export const Footer: React.FC<FooterProps> = () => {
  const navigation = {
    main: [
      { name: 'company.at', href: 'https://company.at' },
      {
        name: 'Developer Jobs in Österreich',
        href: 'https://company.at/jobs',
      },
      { name: 'Impressum', href: 'https://company.at/page/impressum' },
    ],
    social: [
      // {
      //   name: 'example link',
      //   href: 'https://example.at',
      //   icon: AcademicCapIcon
      // }
    ] as LinkEntry[],
  }

  const renderSocials = () =>
    navigation.social.length > 0 ? (
      <div className="mt-8 flex justify-center space-x-6">
        {navigation.social.map((entry) => (
          <div key={entry.name} className="px-5 py-2">
            <a
              href={entry.href}
              rel="noopener"
              className="flex flex-row whitespace-nowrap items-center text-base text-gray-500 hover:text-gray-900"
            >
              <span className="sr-only">{entry.name}</span>
              <span className="text-gray-900 ">{entry.name}</span>
              {entry.icon &&
                React.createElement(entry.icon, {
                  key: entry.name + entry.href,
                  className: 'h-6 w-6',
                })}
            </a>
          </div>
        ))}
      </div>
    ) : (
      []
    )

  const renderMain = () => (
    <nav
      className="-mx-5 -my-2 flex flex-col sm:flex-row flex-wrap items-center justify-center"
      aria-label="Footer"
    >
      {navigation.main.map((entry) => (
        <div key={entry.name} className="px-5 py-2">
          <a
            href={entry.href}
            rel="noopener"
            className="text-base text-gray-500 hover:text-gray-900"
          >
            {entry.name}
          </a>
        </div>
      ))}
    </nav>
  )

  return (
    <footer className="relative">
      <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
        {renderMain()}
        {renderSocials()}

        <p className="mt-8 text-center text-base text-gray-400">
          &copy; {new Date().getFullYear()} NFT
        </p>
      </div>
      <CookieConsent />
    </footer>
  )
}
