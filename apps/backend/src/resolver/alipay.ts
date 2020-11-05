import AlipaySdk from 'alipay-sdk'
import fs from 'fs'
import { resolve } from 'path'

const appId = process.env.APP_ID || ``

const alipay = new AlipaySdk({
  gateway: `https://openapi.alipaydev.com/gateway.do`,
  appId,
  signType: 'RSA2',
  timeout: 5000,
  camelcase: true,
  privateKey: fs.readFileSync(
    resolve(__dirname, 'pem', 'app_private.pem'),
    'ascii'
  ),
  alipayPublicKey: fs.readFileSync(
    resolve(__dirname, 'pem', 'alipay_public.pem'),
    'ascii'
  ),
})

export { alipay }
