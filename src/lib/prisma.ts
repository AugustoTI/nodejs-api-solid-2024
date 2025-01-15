import { PrismaClient } from '@prisma/client'

import { env } from './env'

export const db = new PrismaClient({
  log: env.NODE_ENV === 'development' ? ['query'] : [],
  errorFormat: 'pretty',
})
