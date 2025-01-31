import { randomUUID } from 'node:crypto'
import { type Prisma, type User } from '@prisma/client'

import { UsersRepository } from '../users-repository.interface'

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []

  async create(data: Prisma.UserCreateInput): Promise<User> {
    const user = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created_at: new Date(),
    }

    this.items.push(user)

    return user
  }
  async findByEmail(email: string): Promise<User | null> {
    const result = this.items.find(user => user.email === email)

    return result ? result : null
  }

  async findById(userId: string): Promise<User | null> {
    const result = this.items.find(user => user.id === userId)

    return result ? result : null
  }
}
