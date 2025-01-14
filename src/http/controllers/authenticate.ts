import { type FastifyReply, type FastifyRequest } from 'fastify'
import { z } from 'zod'
import { PrismaUserRepository } from '@/repositories/prisma/prisma-users-repository'
import { AuthenticateUseCase } from '@/use-cases/authenticate'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials'

export async function authenticate(req: FastifyRequest, res: FastifyReply) {
  const registerBodySchema = z.object({
    email: z.string().email(),
    password: z.string(),
  })

  const bodyParsed = registerBodySchema.parse(req.body)

  try {
    const usersRepository = new PrismaUserRepository()
    const registerUseCase = new AuthenticateUseCase(usersRepository)

    await registerUseCase.execute(bodyParsed)
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return res.status(400).send({ message: err.message })
    }

    throw err
  }

  return res.status(200).send()
}
