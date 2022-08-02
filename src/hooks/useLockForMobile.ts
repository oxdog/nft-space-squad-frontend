import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useWindowDimensions } from './useWindowDimensions'

export const useLockForMobile = (redirect: string) => {
  const windowDimension = useWindowDimensions()
  const router = useRouter()

  const MOBILE_WIDTH_TH = 768

  useEffect(() => {
    if (windowDimension.width <= MOBILE_WIDTH_TH) {
      router.push(redirect)
    }
  }, [windowDimension, redirect, router])
}
