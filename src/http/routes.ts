import { type FastifyInstance } from 'fastify'
import { registerUser } from './controllers/register'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', registerUser)
}
