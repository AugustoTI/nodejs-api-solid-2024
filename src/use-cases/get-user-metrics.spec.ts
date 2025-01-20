import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'

import { GetUserMetricsUseCase } from './get-user-metrics'

let checkInRepository: InMemoryCheckInsRepository
let sut: GetUserMetricsUseCase

describe('USE CASE --> Get user metrics', () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInsRepository()
    sut = new GetUserMetricsUseCase(checkInRepository)
  })

  it('should be able to get check-ins from metrics', async () => {
    await checkInRepository.create({
      gym_id: 'gym-1',
      user_id: 'user-1',
    })

    await checkInRepository.create({
      gym_id: 'gym-2',
      user_id: 'user-1',
    })

    const { checkInsCount } = await sut.execute({
      userId: 'user-1',
    })

    expect(checkInsCount).toEqual(2)
  })
})
