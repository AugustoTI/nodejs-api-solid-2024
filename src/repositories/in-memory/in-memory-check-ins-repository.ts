import { randomUUID } from 'node:crypto'
import { Prisma, type CheckIn } from '@prisma/client'
import dayjs from 'dayjs'

import { CheckInsRepository } from '../check-ins-repository.interface'

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public items: CheckIn[] = []

  async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
    const checkIn: CheckIn = {
      id: randomUUID(),
      gym_id: data.gym_id,
      user_id: data.user_id,
      created_at: new Date(),
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
    }

    this.items.push(checkIn)

    return checkIn
  }

  async findById(id: string): Promise<CheckIn | null> {
    const result = this.items.find(checkIn => checkIn.id === id)

    return result ? result : null
  }

  async findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null> {
    const startOfTheDay = dayjs(date).startOf('date')
    const endOfTheDay = dayjs(date).endOf('date')

    const checkOnSameDate = this.items.find(checkIn => {
      const checkInDate = dayjs(checkIn.created_at)
      const isOnSameDate =
        checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay)

      return checkIn.user_id === userId && isOnSameDate
    })

    if (!checkOnSameDate) return null

    return checkOnSameDate
  }

  async findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
    return this.items
      .filter(checkIn => checkIn.user_id === userId)
      .slice((page - 1) * 20, page * 20)
  }

  async countByUserId(userId: string): Promise<number> {
    return this.items.filter(checkIn => checkIn.user_id === userId).length
  }

  async save(checkInUpdated: CheckIn): Promise<CheckIn> {
    const checkInIndex = this.items.findIndex(checkIn => checkIn.id === checkInUpdated.id)

    if (checkInIndex >= 0) {
      this.items[checkInIndex] = checkInUpdated
    }

    return checkInUpdated
  }
}
