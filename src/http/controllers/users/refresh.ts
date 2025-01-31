import { type FastifyReply, type FastifyRequest } from 'fastify'

import { env } from '@/lib/env'

export async function refresh(req: FastifyRequest, res: FastifyReply) {
  await req.jwtVerify({ onlyCookie: true })

  const token = await res.jwtSign(
    {},
    {
      sign: {
        sub: req.user.sub,
      },
    },
  )

  const refreshToken = await res.jwtSign(
    {},
    {
      sign: {
        sub: req.user.sub,
        expiresIn: '7d',
      },
    },
  )

  return res
    .status(200)
    .setCookie('refreshToken', refreshToken, {
      path: '/',
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: true,
    })
    .send({ token })
}
