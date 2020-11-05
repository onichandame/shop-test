export type NotifyRequestQuery = {
  notify_time: string
  notify_type: string
  notify_id: string
  app_id: string
  charset: string
  version: string
  sign_type: string
  sign: string
  trade_no: string
  out_trade_no: string
  out_biz_no?: string
  buyer_id?: string
  buyer_logon_id?: string
  seller_id?: string
  seller_email?: string
  trade_status?: string
}

export const isNotifyRequestQuery = (raw: any): raw is NotifyRequestQuery =>
  !!raw
