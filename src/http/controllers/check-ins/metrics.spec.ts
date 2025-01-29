import { agent } from 'supertest'

import { app } from '@/app'
import { db } from '@/lib/prisma'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Check-In History (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able get to the total count of check-ins', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const user = await db.user.findFirstOrThrow()

    const gym = await db.gym.create({
      data: {
        title: 'Javascript Gym',
        latitude: -27.2092052,
        longitude: -49.6401091,
      },
    })

    await db.checkIn.createMany({
      data: [
        {
          gym_id: gym.id,
          user_id: user.id,
        },
        {
          gym_id: gym.id,
          user_id: user.id,
        },
      ],
    })

    const response = await agent(app.server)
      .get('/check-ins/metrics')
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: -27.2092052,
        longitude: -49.6401091,
      })

    expect(response.statusCode).toEqual(200)
    expect(response.body.checkInsCount).toEqual(2)
  })
})
