import { fastify } from 'fastify'
import { ZodError } from 'zod'

import { appRoutes } from './http/routes'
import { env } from './lib/env'

export const app = fastify()

app.register(appRoutes)

app.setErrorHandler((error, _, res) => {
  if (error instanceof ZodError) {
    return res.status(400).send({
      message: 'Validation Error',
      issues: error.format(),
    })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO: Show log error to an external tools like Datadog/Sentry/NewRelic...
  }

  return res.status(500).send('Internal Server Error.')
})
