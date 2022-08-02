import React from 'react'

export type WrapperVariant = 'regular' | 'small'

interface WrapperProps {
  variant?: WrapperVariant
}

export const Wrapper: React.FC<WrapperProps> = ({
  children,
  variant = 'regular',
}) => {
  return (
    <div
      className={`mx-auto w-full h-full ${
        variant === 'regular' ? 'max-w-screen-2xl' : 'max-w-screen-sm'
      }`}
    >
      {children}
    </div>
  )
}
