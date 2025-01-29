import { agent } from 'supertest'

import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Search Gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to search gyms by title', async () => {
    const { token } = await createAndAuthenticateUser(app)

    await agent(app.server).post('/gyms').set('Authorization', `Bearer ${token}`).send({
      title: 'Javascript Gym',
      description: 'Some description',
      phone: '(99)99999-999',
      latitude: -27.2092052,
      longitude: -49.6401091,
    })

    await agent(app.server).post('/gyms').set('Authorization', `Bearer ${token}`).send({
      title: 'Typescript Gym',
      description: 'Some description',
      phone: '(99)99999-999',
      latitude: -27.2092052,
      longitude: -49.6401091,
    })

    const response = await agent(app.server)
      .get('/gyms/search')
      .query({
        query: 'Javascript',
      })
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'Javascript Gym',
      }),
    ])
  })
})
