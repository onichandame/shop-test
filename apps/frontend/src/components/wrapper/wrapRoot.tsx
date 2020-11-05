import React, { FC } from 'react'
import { WrapRootElementBrowserArgs } from 'gatsby'
import { SnackbarProvider } from 'notistack'
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  HttpLink
} from '@apollo/client'
import fetch from 'isomorphic-fetch'

const client = new ApolloClient({
  link: new HttpLink({ uri: `/api/graphql`, fetch }),
  cache: new InMemoryCache()
})

export const wrapRootElement: FC<WrapRootElementBrowserArgs> = ({
  element
}) => {
  return (
    <SnackbarProvider maxSnack={3}>
      <ApolloProvider client={client}>{element}</ApolloProvider>
    </SnackbarProvider>
  )
}
