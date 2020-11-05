import { AlipaySdkCommonResult } from 'alipay-sdk'

export const isCommonResult = (raw: any): raw is AlipaySdkCommonResult =>
  !!raw && raw.code && raw.msg && raw.subCode && raw.subMsg

type AlipaySdkPrePayResult = {
  outTradeNo: string
  qrCode: string
} & AlipaySdkCommonResult

export const isPrePayResult = (raw: any): raw is AlipaySdkPrePayResult =>
  !!raw && raw.outTradeNo && raw.qrCode && isCommonResult(raw)
