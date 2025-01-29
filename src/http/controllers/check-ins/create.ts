import { type FastifyReply, type FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeCheckInUseCase } from '@/use-cases/factories/make-check-in-use-case'

export async function create(req: FastifyRequest, res: FastifyReply) {
  const createCheckInParamsSchema = z.object({
    gymId: z.string().cuid(),
  })

  const createCheckInBodySchema = z.object({
    latitude: z.number().refine(value => Math.abs(value) <= 90),
    longitude: z.number().refine(value => Math.abs(value) <= 180),
  })

  const bodyParsed = createCheckInBodySchema.parse(req.body)
  const paramsParsed = createCheckInParamsSchema.parse(req.params)

  const checkInUseCase = makeCheckInUseCase()

  await checkInUseCase.execute({
    userId: req.user.sub,
    gymId: paramsParsed.gymId,
    userLatitude: bodyParsed.latitude,
    userLongitude: bodyParsed.longitude,
  })

  return res.status(201).send()
}
