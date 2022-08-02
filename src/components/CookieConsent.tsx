import React, { useCallback, useEffect, useState } from 'react'

interface CookieConsentProps {}

export const CookieConsent: React.FC<CookieConsentProps> = () => {
  const [show, setShow] = useState<boolean>(false)

  const storageName = 'cookieConsent'

  const checkConsent = useCallback(() => {
    const consent = localStorage.getItem(storageName)
    setShow(consent !== 'true')
  }, [storageName])

  const consent = () => {
    localStorage.setItem(storageName, 'true')
    checkConsent()
  }

  useEffect(() => checkConsent(), [checkConsent])

  return (
    <div
      aria-live="assertive"
      className="fixed inset-0 z-30 flex items-end px-2 py-6 pointer-events-none sm:p-6 sm:items-start_"
    >
      <div className="w-full flex flex-col items-center space-y-4 sm:items-end mb-2 lg:mb-12">
        {show && (
          <div className="max-w-md w-full bg-dmss-dark shadow-lg rounded-lg pointer-events-auto flex divide-x divide-gray-200">
            <div className="w-0 flex-1 flex items-center p-4">
              <div className="w-full">
                <p className="text-sm font-medium">🍪 We use Cookies 🍪</p>
                <p className="mt-1 text-sm">
                  To improve user experience and to provide certain services and
                  functionality to users.
                </p>
              </div>
            </div>
            <div className="flex">
              <div
                className="
                  flex flex-col
                  divide-y divide-gray-200 
                "
              >
                <div className="h-0 flex-1 flex">
                  <button
                    className="w-full border border-transparent rounded-none rounded-tr-lg px-4 py-3 flex items-center justify-center text-sm font-medium text-dmss-accent1-50"
                    onClick={consent}
                  >
                    Agree
                  </button>
                </div>
                <div className="h-0 flex-1 flex">
                  <a
                    href="https://www.NFTspacesquad.com/privacy-policy/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full border border-transparent rounded-none rounded-br-lg px-4 py-3 flex items-center justify-center text-sm"
                  >
                    Details
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
