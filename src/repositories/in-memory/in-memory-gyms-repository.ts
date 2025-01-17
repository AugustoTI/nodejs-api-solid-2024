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
      id: 'gym-id',
      title: data.title,
      description: data.description || null,
      phone: data.phone || null,
      latitude: data.latitude as Prisma.Decimal,
      longitude: data.longitude as Prisma.Decimal,
    }

    this.gymsRepository.push(newGym)

    return newGym
  }
}
