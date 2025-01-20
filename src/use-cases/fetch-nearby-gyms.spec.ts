import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

let gymsInRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe('USE CASE --> Search gyms', () => {
  beforeEach(async () => {
    gymsInRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsUseCase(gymsInRepository)
  })

  it('should be able to fetch nearby gyms', async () => {
    await gymsInRepository.create({
      title: 'Near Gym',
      description: null,
      phone: null,
      latitude: -27.2092052,
      longitude: -49.6401091,
    })

    await gymsInRepository.create({
      title: 'Far Gym',
      description: null,
      phone: null,
      latitude: -27.061092,
      longitude: -49.5229501,
    })

    const { gyms } = await sut.execute({
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })])
  })
})
