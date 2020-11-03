import AlipaySdk from 'alipay-sdk'
import fs from 'fs'
import { resolve } from 'path'

const appId = process.env.APP_ID || ``

const alipay = new AlipaySdk({
  gateway: `https://openapi.alipaydev.com/gateway.do`,
  appId,
  privateKey: fs.readFileSync(
    resolve(__dirname, 'pem', 'app_private.pem'),
    'ascii'
  ),
})

export { alipay }
