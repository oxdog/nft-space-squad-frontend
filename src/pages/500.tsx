import { Layout } from '@components/Layout'
import Link from 'next/link'
import React from 'react'

const ErrorPage = () => {
  return (
    <Layout>
      <div className="relative px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
        <div className="max-w-max mx-auto">
          <main className="sm:flex">
            <p className="text-4xl font-extrabold text-blue-600  sm:text-5xl">500</p>
            <div className="sm:ml-6">
              <div className="sm:border-l sm:border-gray-200 sm:pl-6">
                <h1 className="text-4xl font-extrabold text-black dark:text-white tracking-tight sm:text-5xl">
                  Sorry something broke
                </h1>
                <p className="mt-1 text-base text-gray-500">Try again later....</p>
              </div>
              <div className="mt-10 flex space-x-3 sm:border-l sm:border-transparent sm:pl-6">
                <Link passHref={true} href="/">
                  <span className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Go back home
                  </span>
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </Layout>
  )
}
export default ErrorPage
