import 'reflect-metadata'
import { buildSchemaSync } from 'type-graphql'

import './alipay'

import { PayResolver } from './pay'
import { BillResolver } from './bill'

export const schema = buildSchemaSync({
  resolvers: [PayResolver, BillResolver],
  validate: false,
})
