import { config } from 'dotenv'
import Express from 'express'

config()

import { server } from './server'

const port = parseInt(process.env.PORT || '') || 3000

const app = Express()

server.applyMiddleware({ app, path: `/` })

app.listen(port, () => {
  console.log(`🚀 main server ready at ${server.graphqlPath}}`)
  console.log(`🚀 subscriptions server ready at ${server.subscriptionsPath}}`)
})
