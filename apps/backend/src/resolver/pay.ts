import {
  registerEnumType,
  ObjectType,
  Query,
  Field,
  Resolver,
  Mutation,
  ArgsType,
  Args,
} from 'type-graphql'
import { v4 as randstr } from 'uuid'

import { alipay } from './alipay'
import { isCommonResult, isPrePayResult } from '../util'
import { db } from '../db'

@ArgsType()
class PrePayArgs {
  @Field(() => Number, { nullable: false })
  totalAmount!: number
  @Field(() => Number, { nullable: true, defaultValue: 0 })
  discountableAmount!: number
  @Field(() => String, { nullable: true, defaultValue: `void` })
  subject!: string
}

@ObjectType()
class PrePayResponse {
  @Field(() => String)
  qrCode!: string
  @Field(() => String)
  outTradeNo!: string
}

@ArgsType()
class PayStatusArgs {
  @Field(() => String, { nullable: false })
  tradeId!: string
}

enum Status {
  done = `done`,
  pending = `pending`,
}
registerEnumType(Status, { name: `Status` })

@ObjectType()
class PayStatusResponse {
  @Field(() => Status)
  status!: Status
}

@Resolver()
export class PayResolver {
  @Query(() => PayStatusResponse)
  async payStatus(
    @Args() { tradeId }: PayStatusArgs
  ): Promise<PayStatusResponse> {
    const trades = db.get(`trades`)
    return {
      status:
        trades.indexOf(tradeId).value() >= 0 ? Status.pending : Status.done,
    }
  }
  // QR code request
  @Mutation(() => PrePayResponse)
  async prePay(
    @Args() { totalAmount, discountableAmount, subject }: PrePayArgs
  ): Promise<PrePayResponse> {
    const trades = db.get(`trades`)
    const outTradeNo = randstr()
    trades.push(outTradeNo).write()
    const res = await alipay.exec(`alipay.trade.precreate`, {
      appAutoToken: '',
      bizContent: {
        outTradeNo,
        totalAmount,
        discountableAmount,
        subject,
      },
    })
    if (isPrePayResult(res)) {
      return { qrCode: res.qrCode, outTradeNo: res.outTradeNo }
    } else if (isCommonResult(res)) {
      throw new Error(`prePay failed due to ${JSON.stringify(res)}`)
    } else {
      throw new Error(
        `prePay failed to receive result. Received: ${JSON.stringify(res)}`
      )
    }
  }
}
