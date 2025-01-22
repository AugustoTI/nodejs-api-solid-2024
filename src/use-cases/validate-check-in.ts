import { type CheckIn } from '@prisma/client'
import dayjs from 'dayjs'

import { type CheckInsRepository } from '@/repositories/check-ins-repository.interface'

import { LateCheckInValidationError } from './errors/late-check-in-validation'
import { ResourceNotFoundError } from './errors/resource-not-found'

interface ValidateCheckInUseCaseParams {
  checkInId: string
}

interface ValidateCheckInUseCaseResponse {
  checkIn: CheckIn
}

export class ValidateCheckInUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    checkInId,
  }: ValidateCheckInUseCaseParams): Promise<ValidateCheckInUseCaseResponse> {
    const checkIn = await this.checkInsRepository.findById(checkInId)

    if (!checkIn) throw new ResourceNotFoundError()

    const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
      checkIn.created_at,
      'minutes',
    )

    if (distanceInMinutesFromCheckInCreation > 20) throw new LateCheckInValidationError()

    checkIn.validated_at = new Date()

    const checkUpdated = await this.checkInsRepository.save(checkIn)

    return { checkIn: checkUpdated }
  }
}
