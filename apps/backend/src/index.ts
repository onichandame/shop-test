import { config } from 'dotenv'

config()

import { app, apollo } from './server'
import './db'

const port = parseInt(process.env.PORT || '') || 3000

app.listen(port, () => {
  console.log(`🚀 main server ready at ${apollo.graphqlPath}}`)
  console.log(`🚀 subscriptions server ready at ${apollo.subscriptionsPath}}`)
})
