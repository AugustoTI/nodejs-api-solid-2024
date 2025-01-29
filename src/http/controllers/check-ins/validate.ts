import { type FastifyReply, type FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeValidateCheckInUseCase } from '@/use-cases/factories/make-validate-check-in-use-case'

export async function validate(req: FastifyRequest, res: FastifyReply) {
  const validateCheckInParamsSchema = z.object({
    checkInId: z.string().cuid(),
  })

  const paramsParsed = validateCheckInParamsSchema.parse(req.params)

  const validateCheckInUseCase = makeValidateCheckInUseCase()

  await validateCheckInUseCase.execute(paramsParsed)

  return res.status(204).send()
}
