import { useRouter } from 'next/router'
import { useEffect } from 'react'

type QueryData = any | undefined

type DataLoadingTuple = [QueryData, boolean]

export const useRedirect = (
  destination: string,
  origin: string,
  ...args: DataLoadingTuple[]
) => {
  const router = useRouter()

  useEffect(() => {
    const isError = args.map(([data, loading]) => !data && !loading).includes(true)

    if (isError) {
      router.push({
        pathname: destination,
        query: { origin: origin !== '' ? encodeURI(origin) : undefined },
      })
    }
  }, [args, router, destination, origin])
}
