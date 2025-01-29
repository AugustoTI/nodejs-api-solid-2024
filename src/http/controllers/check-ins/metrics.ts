import { type FastifyReply, type FastifyRequest } from 'fastify'

import { makeGetUserMetricsUseCase } from '@/use-cases/factories/make-get-user-metrics-use-case'

export async function metrics(req: FastifyRequest, res: FastifyReply) {
  const getUserMetricsUseCase = makeGetUserMetricsUseCase()

  const { checkInsCount } = await getUserMetricsUseCase.execute({
    userId: req.user.sub,
  })

  return res.status(200).send({ checkInsCount })
}
