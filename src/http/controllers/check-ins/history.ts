import { type FastifyReply, type FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeFetchCheckInsHistoryUseCase } from '@/use-cases/factories/make-fetch-user-check-ins-history-use-case'

export async function history(req: FastifyRequest, res: FastifyReply) {
  const CheckInHistoryQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  })

  const bodyParsed = CheckInHistoryQuerySchema.parse(req.query)

  const historyGymsUseCase = makeFetchCheckInsHistoryUseCase()

  const { checkIns } = await historyGymsUseCase.execute({
    page: bodyParsed.page,
    userId: req.user.sub,
  })

  return res.status(200).send({ checkIns })
}
