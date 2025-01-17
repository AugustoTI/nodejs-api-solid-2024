import { randomUUID } from 'node:crypto'
import { Prisma, type Gym } from '@prisma/client'

import { type GymsRepository } from '../gyms-repository.interface'

export class InMemoryGymsRepository implements GymsRepository {
  private gymsRepository: Gym[] = []

  async findById(gymId: string): Promise<Gym | null> {
    const result = this.gymsRepository.find(gym => gym.id === gymId)

    return result ? result : null
  }

  async create(data: Prisma.GymCreateInput): Promise<Gym> {
    const newGym: Gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
      created_at: new Date(),
    }

    this.gymsRepository.push(newGym)

    return newGym
  }
}
