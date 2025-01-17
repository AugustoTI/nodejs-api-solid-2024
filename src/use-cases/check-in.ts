import { type CheckIn } from '@prisma/client'

import { type CheckInsRepository } from '@/repositories/check-ins-repository.interface'
import { GymsRepository } from '@/repositories/gyms-repository.interface'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'

import { MaxDistancieError } from './errors/max-distancie'
import { MaxNumbersOfCheckInsError } from './errors/max-numbers-off-check-ins'
import { ResourceNotFoundError } from './errors/resource-not-found'

interface CheckInUseCaseParams {
  userId: string
  gymId: string
  userLatitude: number
  userLongitude: number
}

interface CheckInUseCaseResponse {
  checkIn: CheckIn
}

export class CheckInUseCase {
  constructor(
    private checkInsRepository: CheckInsRepository,
    private gymsRepository: GymsRepository,
  ) {}

  async execute({
    userId,
    gymId,
    userLatitude,
    userLongitude,
  }: CheckInUseCaseParams): Promise<CheckInUseCaseResponse> {
    const gym = await this.gymsRepository.findById(gymId)

    if (!gym) throw new ResourceNotFoundError()

    const distance = getDistanceBetweenCoordinates(
      {
        latitude: userLatitude,
        longitude: userLongitude,
      },
      {
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber(),
      },
    )

    const MAX_DISTANCE_IN_KILOMETERS = 0.1

    if (distance > MAX_DISTANCE_IN_KILOMETERS) throw new MaxDistancieError()

    const checkInOnSameDay = await this.checkInsRepository.findByUserIdOnDate(
      userId,
      new Date(),
    )

    if (checkInOnSameDay) throw new MaxNumbersOfCheckInsError()

    const checkIn = await this.checkInsRepository.create({
      gym_id: gymId,
      user_id: userId,
    })

    return { checkIn }
  }
}
