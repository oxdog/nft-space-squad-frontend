import { ApolloClient, from, HttpLink, InMemoryCache } from '@apollo/client'
import { NextPageContext } from 'next'
import { onError } from '@apollo/client/link/error'
import { createWithApollo } from './createWithApollo'

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    )

  if (networkError) {
    console.log(`[Network error]: ${networkError}`)
    if (typeof window !== 'undefined') {
      window.location.replace('/500')
    }
  }
})

let httpLink = (ctx: NextPageContext) => {
  return new HttpLink({
    uri: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      cookie:
        typeof window === 'undefined'
          ? (ctx?.req?.headers.cookie as string)
          : 'undefined',
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
      credentials: 'include',
    },
  })
}

const apolloClient = (ctx: NextPageContext) =>
  new ApolloClient({
    link: from([errorLink, httpLink(ctx)]),
    uri: process.env.NEXT_PUBLIC_API_URL,

    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            TechLeadStoryPagination: {
              keyArgs: [],
              merge(existing, incoming) {
                return {
                  ...incoming,
                  items: [...(existing?.items || []), ...incoming.items],
                }
              },
            },
          },
        },
      },
    }),
  })

export default createWithApollo(apolloClient)
