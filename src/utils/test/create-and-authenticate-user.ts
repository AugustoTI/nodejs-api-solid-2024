import { type FastifyInstance } from 'fastify'
import { agent } from 'supertest'

export async function createAndAuthenticateUser(app: FastifyInstance) {
  await agent(app.server).post('/users').send({
    name: 'John Doe',
    email: 'johndoe@example.com',
    password: '123456',
  })

  const authResponse = await agent(app.server).post('/sessions').send({
    email: 'johndoe@example.com',
    password: '123456',
  })

  const { token } = authResponse.body

  return { token }
}
