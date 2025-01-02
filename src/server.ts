import { app } from './app'
import { env } from './lib/env'

app
  .listen({
    host: '0.0.0.0',
    port: env.PORT,
  })
  .then(() => {
    console.log(`HTTP Server Running: http://0.0.0.0:${env.PORT}`)
  })
