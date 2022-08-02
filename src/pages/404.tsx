import { Layout } from '@components/Layout'
import { isServer } from '@utils/isServer'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

const NotFoundPage = () => {
  const router = useRouter()

  console.log(router.query)
  let { origin } = router.query

  if (!origin) {
    origin = !isServer() ? window.location.toString() : ''
  }

  return (
    <Layout>
      <div className="relative px-4 py-16 sm:px-6 pt-48 md:grid md:place-items-center lg:px-8">
        <div className="max-w-max mx-auto">
          <main className="flex flex-col items-center space-y-8">
            <div className="text-6xl font-extrabold text-dmss-accent1-50  sm:text-5xl">
              404
            </div>
            <div className="flex flex-col items-center space-y-8">
              <h1 className="text-4xl font-extrabold text-black dark:text-white tracking-tight sm:text-5xl">
                Page not found
              </h1>
              <p className="mt-1 text-base text-gray-400">
                The page you were looking for{' '}
                <span className="font-extrabold">{origin}</span> does not exists.
              </p>
            </div>
            <div className="mt-10 flex space-x-3 sm:border-l sm:border-transparent sm:pl-6">
              <Link passHref={true} href="/">
                <span className="inline-flex cursor-pointer items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-dmss-accent1-100 hover:bg-dmss-accent1-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Go back home
                </span>
              </Link>
            </div>
          </main>
        </div>
      </div>
    </Layout>
  )
}

export default NotFoundPage
