import { ApolloServer } from 'apollo-server-express'
import Express, { Router } from 'express'
import bodyParser from 'body-parser'
import debug from 'debug'

import { schema } from './resolver'
import { isNotifyRequestQuery, NotifyRequestQuery } from './types'
import { db } from './db'

const logger = debug(`Web:Backend`)

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
router.post(
  `/notify`,
  bodyParser.urlencoded({ extended: true }),
  (req, res) => {
    let result: NotifyResponse
    logger(`received request ${JSON.stringify(req.body)}`)
    try {
      if (!isNotifyRequestQuery(req.body)) throw new Error(`request invalid`)
      const query = req.body as NotifyRequestQuery
      switch (query.notify_type) {
        case `trade_status_sync`: {
          switch (query.trade_status) {
            case `TRADE_SUCCESS`: {
              if (query.out_trade_no) {
                db.get(`trades`)
                  .pull(query.out_trade_no)
                  .write()
              } else {
                throw new Error(`outTradeNo cannot be empty`)
              }
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
  }
)
app.use('/api', router)

export { apollo, app }
