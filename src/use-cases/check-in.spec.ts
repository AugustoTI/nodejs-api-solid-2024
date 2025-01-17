import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'

import { CheckInUseCase } from './check-in'

let checkInRepository: InMemoryCheckInsRepository
let sut: CheckInUseCase

describe('USE CASE --> Check in', () => {
  beforeEach(() => {
    checkInRepository = new InMemoryCheckInsRepository()
    sut = new CheckInUseCase(checkInRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-id',
      userId: 'user-id',
    })

    expect(checkIn.id).toString()
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2025, 0, 16, 18))

    await sut.execute({
      gymId: 'gym-id',
      userId: 'user-id',
    })

    await expect(
      sut.execute({
        gymId: 'gym-id',
        userId: 'user-id',
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2025, 0, 16, 18))

    await sut.execute({
      gymId: 'gym-id',
      userId: 'user-id',
    })

    vi.setSystemTime(new Date(2025, 0, 17, 18))

    await expect(
      sut.execute({
        gymId: 'gym-id',
        userId: 'user-id',
      }),
    ).resolves.toBeTruthy()
  })
})
