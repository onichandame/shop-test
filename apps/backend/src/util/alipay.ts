import { AlipaySdkCommonResult } from 'alipay-sdk'

export const isCommonResult = (raw: any): raw is AlipaySdkCommonResult =>
  !!raw && raw.code && raw.msg

type AlipaySdkPrePayResult = {
  outTradeNo: string
  qrCode: string
} & AlipaySdkCommonResult

export const isPrePayResult = (raw: any): raw is AlipaySdkPrePayResult =>
  !!raw && raw.outTradeNo && raw.qrCode && isCommonResult(raw)

type AlipaySdkBillQueryResult = {
  billDownloadUrl: string
} & AlipaySdkCommonResult

export const isBillQueryResult = (raw: any): raw is AlipaySdkBillQueryResult =>
  !!raw && typeof raw.billDownloadUrl === 'string' && isCommonResult(raw)
