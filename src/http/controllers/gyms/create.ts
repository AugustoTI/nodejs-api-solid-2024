import { type FastifyReply, type FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeCreateGymsUseCase } from '@/use-cases/factories/make-create-gym-use-case'

export async function create(req: FastifyRequest, res: FastifyReply) {
  const createBodySchema = z.object({
    title: z.string(),
    description: z.string().nullable(),
    phone: z.string().nullable(),
    latitude: z.number().refine(value => Math.abs(value) <= 90),
    longitude: z.number().refine(value => Math.abs(value) <= 180),
  })

  const bodyParsed = createBodySchema.parse(req.body)

  const createGymUseCase = makeCreateGymsUseCase()

  await createGymUseCase.execute(bodyParsed)

  return res.status(201).send()
}
