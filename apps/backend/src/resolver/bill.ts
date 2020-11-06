import {
  Args,
  ArgsType,
  Field,
  ObjectType,
  Query,
  Resolver,
} from 'type-graphql'
import debug from 'debug'

import { isBillQueryResult } from '../util'
import { alipay } from './alipay'

const logger = debug(`Web:Backend:Resolver:Bill`)

@ArgsType()
class BillArgs {
  @Field(() => String, { nullable: false })
  date!: string
}

@ObjectType()
class BillResponse {
  @Field(() => String, { nullable: false })
  billUrl!: string
}

@Resolver()
export class BillResolver {
  @Query(() => BillResponse)
  async bill(@Args() { date }: BillArgs): Promise<BillResponse> {
    try {
      logger(`received bill request`)
      const res = await alipay.exec(
        `alipay.data.dataservice.bill.downloadurl.query`,
        { bizContent: { billType: `trade`, billDate: date } }
      )
      if (isBillQueryResult(res)) {
        return { billUrl: res.billDownloadUrl }
      } else {
        throw new Error(
          `bill cannot be queried. received: ${JSON.stringify(res)}`
        )
      }
    } catch (e) {
      logger(`bill query failed`)
      throw e
    }
  }
}
