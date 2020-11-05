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
import AlipayFormData from 'alipay-sdk/lib/form'
import debug from 'debug'

import { alipay } from './alipay'
import { isCommonResult, isPrePayResult } from '../util'
import { db } from '../db'

const logger = debug(`Web:Backend`)

@ArgsType()
class PayArgs {
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

@ObjectType()
class PayResponse {
  @Field(() => String)
  payUrl!: string
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
  @Mutation(() => PayResponse)
  async pay(
    @Args() { totalAmount, discountableAmount, subject }: PayArgs
  ): Promise<PayResponse> {
    logger(
      `received payment request ${JSON.stringify({
        totalAmount,
        subject,
        discountableAmount,
      })}`
    )
    const outTradeNo = randstr()
    const trades = db.get(`trades`)
    trades.push(outTradeNo).write()
    const formData = new AlipayFormData()
    formData.setMethod('get')
    formData.addField('appId', alipay.config.appId)
    formData.addField(
      'notify_url',
      `http://work.onichandame.com:8081/api/notify`
    )
    formData.addField('charset', alipay.config.charset)
    formData.addField('signType', 'RSA2')
    formData.addField('bizContent', {
      outTradeNo,
      productCode: 'FAST_INSTANT_TRADE_PAY',
      totalAmount,
      subject,
      discountableAmount,
      body: 'test',
    })
    const res = await alipay.exec(`alipay.trade.page.pay`, {}, { formData })
    return { payUrl: res.toString() }
  }
  // QR code request
  @Mutation(() => PrePayResponse)
  async prePay(
    @Args() { totalAmount, discountableAmount, subject }: PayArgs
  ): Promise<PrePayResponse> {
    const outTradeNo = randstr()
    const trades = db.get(`trades`)
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
