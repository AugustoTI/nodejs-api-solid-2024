import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'

import { LateCheckInValidationError } from './errors/late-check-in-validation'
import { ResourceNotFoundError } from './errors/resource-not-found'
import { ValidateCheckInUseCase } from './validate-check-in'

let checkInRepository: InMemoryCheckInsRepository
let sut: ValidateCheckInUseCase

describe('USE CASE --> Validate Check in', () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInsRepository()
    sut = new ValidateCheckInUseCase(checkInRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to validate the check-in', async () => {
    const checkInCreated = await checkInRepository.create({
      user_id: 'user-id',
      gym_id: 'gym-id',
    })

    const { checkIn: checkInValidated } = await sut.execute({
      checkInId: checkInCreated.id,
    })

    console.log(checkInValidated.validated_at)

    expect(checkInValidated.validated_at).toEqual(expect.any(Date))
    expect(checkInRepository.items[0].validated_at).toEqual(expect.any(Date))
  })

  it('should not be able to validate an inexistent check-in', async () => {
    await expect(
      sut.execute({
        checkInId: 'check-id-wrong',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to validate the check-in after 20 minutes of its creation', async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 13, 40))

    const checkInCreated = await checkInRepository.create({
      user_id: 'user-id',
      gym_id: 'gym-id',
    })

    const twentyOneMinutesInMs = 1000 * 60 * 21

    vi.advanceTimersByTime(twentyOneMinutesInMs)

    await expect(
      sut.execute({
        checkInId: checkInCreated.id,
      }),
    ).rejects.toBeInstanceOf(LateCheckInValidationError)
  })
})
