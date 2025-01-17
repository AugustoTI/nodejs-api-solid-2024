import { type FastifyReply, type FastifyRequest } from 'fastify'
import { z } from 'zod'

import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials'
import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case'

export async function authenticate(req: FastifyRequest, res: FastifyReply) {
  const registerBodySchema = z.object({
    email: z.string().email(),
    password: z.string(),
  })

  const bodyParsed = registerBodySchema.parse(req.body)

  try {
    const registerUseCase = makeAuthenticateUseCase()

    await registerUseCase.execute(bodyParsed)
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return res.status(400).send({ message: err.message })
    }

    throw err
  }

  return res.status(200).send()
}
