import { ApolloServer } from 'apollo-server-express'
import Express, { Router } from 'express'

import { schema } from './resolver'
import { isNotifyRequestQuery, NotifyRequestQuery } from './typings'
import { db } from './db'

const apollo = new ApolloServer({
  schema,
  subscriptions: { path: '/api/graphql' },
})

type NotifyResponse = {
  status: 'success' | 'failed'
  message?: string
}

const app = Express()
const router = Router()

apollo.applyMiddleware({ app, path: `/api/graphql` })

// handle callback from alipay
router.post(`/notify`, (req, res) => {
  let result: NotifyResponse
  try {
    if (!isNotifyRequestQuery(req.query)) throw new Error(`request invalid`)
    const query = req.query as NotifyRequestQuery
    switch (query.notify_type) {
      case `trade_status_sync`: {
        switch (query.trade_status) {
          case `TRADE_SUCCESS`: {
            const trades = db.get(`trades`)
            trades.remove(query.out_trade_no).write()
            break
          }
          default:
            throw new Error(`trade status ${query.trade_status} invalid`)
        }
        break
      }
      default:
        throw new Error(`notify type ${query.notify_type} not valid`)
    }
    result = { status: 'success' }
  } catch (e) {
    result = {
      status: 'failed',
      message: e && e.message ? e.message : JSON.stringify(e),
    }
  }
  res.send(result)
})
app.use('/api', router)

export { apollo, app }
