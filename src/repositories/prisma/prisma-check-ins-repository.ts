import { type CheckIn, type Prisma } from '@prisma/client'
import dayjs from 'dayjs'

import { db } from '@/lib/prisma'

import { type CheckInsRepository } from '../check-ins-repository.interface'

export class PrismaCheckInsRepository implements CheckInsRepository {
  async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
    return db.checkIn.create({ data })
  }

  async save(data: CheckIn): Promise<CheckIn> {
    return db.checkIn.update({
      where: { id: data.id },
      data,
    })
  }

  async findById(id: string): Promise<CheckIn | null> {
    return db.checkIn.findUnique({ where: { id } })
  }

  async findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
    return db.checkIn.findMany({
      where: { user_id: userId },
      take: 20,
      skip: (page - 1) * 20,
    })
  }

  async findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null> {
    const startOfTheDay = dayjs(date).startOf('date')
    const endOfTheDay = dayjs(date).endOf('date')

    const checkIn = await db.checkIn.findFirst({
      where: {
        user_id: userId,
        created_at: {
          gte: startOfTheDay.toDate(),
          lte: endOfTheDay.toDate(),
        },
      },
    })

    if (!checkIn) return null

    return checkIn
  }

  async countByUserId(userId: string): Promise<number> {
    return db.checkIn.count({
      where: { user_id: userId },
    })
  }
}
