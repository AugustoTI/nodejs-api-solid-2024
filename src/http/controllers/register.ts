import { type FastifyReply, type FastifyRequest } from 'fastify'
import { z } from 'zod'
import { registerUseCase } from '@/use-cases/register'

export async function registerUser(req: FastifyRequest, res: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
  })

  const bodyParsed = registerBodySchema.parse(req.body)

  try {
    await registerUseCase(bodyParsed)
  } catch {
    return res.status(409).send()
  }

  return res.status(201).send()
}
