import { fastifyJwt } from '@fastify/jwt'
import { fastify } from 'fastify'
import { ZodError } from 'zod'

import { checkInsRoutes } from './http/controllers/check-ins/routes'
import { gymsRoutes } from './http/controllers/gyms/routes'
import { usersRoutes } from './http/controllers/users/routes'
import { env } from './lib/env'

export const app = fastify()

app.register(fastifyJwt, { secret: env.JWT_SECRET })

app.register(usersRoutes)
app.register(gymsRoutes)
app.register(checkInsRoutes)

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
