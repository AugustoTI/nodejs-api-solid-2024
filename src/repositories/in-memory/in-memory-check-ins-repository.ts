import { randomUUID } from 'node:crypto'
import { Prisma, type CheckIn } from '@prisma/client'
import dayjs from 'dayjs'

import { CheckInsRepository } from '../check-ins-repository.interface'

export class InMemoryCheckInsRepository implements CheckInsRepository {
  private checkInsRepository: CheckIn[] = []

  async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
    const checkIn: CheckIn = {
      id: randomUUID(),
      gym_id: data.gym_id,
      user_id: data.user_id,
      created_at: new Date(),
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
    }

    this.checkInsRepository.push(checkIn)

    return checkIn
  }

  async findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null> {
    const startOfTheDay = dayjs(date).startOf('date')
    const endOfTheDay = dayjs(date).endOf('date')

    const checkOnSameDate = this.checkInsRepository.find(checkIn => {
      const checkInDate = dayjs(checkIn.created_at)
      const isOnSameDate =
        checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay)

      return checkIn.user_id === userId && isOnSameDate
    })

    if (!checkOnSameDate) return null

    return checkOnSameDate
  }
}
