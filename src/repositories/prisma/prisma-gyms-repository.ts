import { type Gym, type Prisma } from '@prisma/client'

import { db } from '@/lib/prisma'

import {
  type FindManyNearbyParams,
  type GymsRepository,
} from '../gyms-repository.interface'

export class PrismaGymsRepository implements GymsRepository {
  async create(data: Prisma.GymCreateInput): Promise<Gym> {
    return db.gym.create({ data })
  }

  async findById(id: string): Promise<Gym | null> {
    return db.gym.findUnique({
      where: { id },
    })
  }

  async searchMany(query: string, page: number): Promise<Gym[]> {
    return db.gym.findMany({
      where: {
        title: { contains: query },
      },
      take: 20,
      skip: (page - 1) * 20,
    })
  }

  async findManyNearby({ latitude, longitude }: FindManyNearbyParams): Promise<Gym[]> {
    const MAX_DISTANCIE_IN_KILOMETERS = 10

    return db.$queryRaw`
      SELECT * FROM gyms
      WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= ${MAX_DISTANCIE_IN_KILOMETERS}
    `
  }
}
