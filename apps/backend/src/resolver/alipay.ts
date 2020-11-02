import AlipaySdk from 'alipay-sdk'

const appId = process.env.APP_ID || ``
const privateKey = process.env.PRIVATE_KEY || ``

const alipay = new AlipaySdk({ appId, privateKey })

export { alipay }
