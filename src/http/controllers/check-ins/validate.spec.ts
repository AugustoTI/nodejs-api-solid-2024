import { agent } from 'supertest'

import { app } from '@/app'
import { db } from '@/lib/prisma'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Validate Check-in (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able get to validate a check-in', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const user = await db.user.findFirstOrThrow()

    const gym = await db.gym.create({
      data: {
        title: 'Javascript Gym',
        latitude: -27.2092052,
        longitude: -49.6401091,
      },
    })

    let checkIn = await db.checkIn.create({
      data: {
        gym_id: gym.id,
        user_id: user.id,
      },
    })

    const response = await agent(app.server)
      .patch(`/check-ins/${checkIn.id}/validate`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toEqual(204)

    checkIn = await db.checkIn.findUniqueOrThrow({
      where: {
        id: checkIn.id,
      },
    })

    expect(checkIn.validated_at).toBeDate()
  })
})
