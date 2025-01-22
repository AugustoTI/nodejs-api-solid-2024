import { randomUUID } from 'node:crypto'
import { Prisma, type Gym } from '@prisma/client'

import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'

import { FindManyNearbyParams, type GymsRepository } from '../gyms-repository.interface'

export class InMemoryGymsRepository implements GymsRepository {
  public items: Gym[] = []

  async findById(gymId: string): Promise<Gym | null> {
    const result = this.items.find(gym => gym.id === gymId)

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

    this.items.push(newGym)

    return newGym
  }

  async searchMany(query: string, page: number): Promise<Gym[]> {
    const itemsPerPage = 20
    const startIndex = (page - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage

    const filteredGyms = this.items.filter(gym =>
      gym.title.toLowerCase().includes(query.toLowerCase()),
    )

    return filteredGyms.slice(startIndex, endIndex)
  }

  async findManyNearby(params: FindManyNearbyParams): Promise<Gym[]> {
    const { latitude, longitude } = params

    const MAX_DISTANCIE_IN_KILOMETERS = 10

    const nearbyGyms = this.items.filter(gym => {
      const distance = getDistanceBetweenCoordinates(
        { latitude, longitude },
        {
          latitude: gym.latitude.toNumber(),
          longitude: gym.longitude.toNumber(),
        },
      )

      return distance < MAX_DISTANCIE_IN_KILOMETERS
    })

    return nearbyGyms
  }
}
