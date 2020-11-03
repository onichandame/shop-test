import 'reflect-metadata'
import { buildSchemaSync } from 'type-graphql'

import './alipay'

import { PayResolver } from './pay'

export const schema = buildSchemaSync({
  resolvers: [PayResolver],
  validate: false,
})
