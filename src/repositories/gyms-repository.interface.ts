import { Prisma, type Gym } from '@prisma/client'

export interface GymsRepository {
  create(data: Prisma.GymCreateInput): Promise<Gym>
  findById(userId: string): Promise<Gym | null>
  searchMany(query: string, page: number): Promise<Gym[]>
}
