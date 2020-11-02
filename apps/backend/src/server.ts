import { ApolloServer } from 'apollo-server-express'

import { schema } from './resolver'

export const server = new ApolloServer({
  schema,
  subscriptions: { path: '/' },
})
