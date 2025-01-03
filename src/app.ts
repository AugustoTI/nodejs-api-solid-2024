import { fastify } from 'fastify'
import { z } from 'zod'
import { db } from './lib/prisma'

export const app = fastify()

app.post('/users', async (req, res) => {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
  })

  const { name, email, password } = registerBodySchema.parse(req.body)

  await db.user.create({
    data: {
      name,
      email,
      password_hash: password,
    },
  })

  return res.status(201).send()
})
