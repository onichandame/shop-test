# 支付功能调研

# 需求

1. 支付宝网页支付
2. 商品、订单、支付管理
3. 对账
4. 对公开票
5. 微信支付

依次调研

# 调研

包含调研过程、结果和复现步骤。

## SDK

sdk 是实现所有功能的基础。根据我们的系统架构，应选择与现有的框架及基础设施的兼容性最佳的 sdk。

### 调研过程

官方提供多语言 sdk([node][nodesdk], [java][javasdk]等)。

- **node:** 老版 sdk，用户和 maintainer 较少。
- **java:** 新版 sdk，尚不成熟。

新版 sdk 现状：

1. 开票功能尚未提供原生支持，需要回归旧版模式
2. 尚未提供 node 版本
3. [阿里未来计划逐步转向新版 sdk][newsdk]
4. 调用方式更方法化：

   ```java
   // 简化入参，新增方法
   AlipayTradePrecreateResponse response = AlipaySdk.exec("alipay.trade.pay") // 旧sdk
   AlipayTradePrecreateResponse response = Payment.FaceToFace()               // 新sdk
   ```

### 调研结果

因现有系统与 node 的兼容性更佳，但新版 sdk 尚不支持 node，且新版 sdk 尚不成熟，对效率提升不明显。故采用旧版 sdk 的 node 版本。需注意跟进阿里对新旧版本 sdk 的支持，前期架构需做好向新版 sdk 迁移的准备。

## 支付宝网页支付

[nodesdk]: https://github.com/alipay/alipay-sdk-nodejs-all
[javasdk]: https://github.com/alipay/alipay-easysdk/tree/master/java
[newsdk]: https://opendocs.alipay.com/open/00y8k9
