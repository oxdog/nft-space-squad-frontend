import React from 'react'
import { Spinner } from './Spinner'

interface LoadingIndicatorProps {}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = () => {
  return (
    <div className="absolute inset-x-0 bottom-8 flex items-center justify-center sm:justify-start px-8">
      <div className="flex items-center pl-2 pr-4 bg-white bg-opacity-10 backdrop-blur-sm rounded-full border-2 z-50 shadow-lg font-extrabold">
        <div className="w-12 h-12 flex items-center justify-center">
          <Spinner color="#fff" width="34" height="34" />
        </div>
        <div className="pl-2">LOADING...</div>
      </div>
    </div>
  )
}
