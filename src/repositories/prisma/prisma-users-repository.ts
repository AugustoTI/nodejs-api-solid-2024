import { type Prisma, type User } from '@prisma/client'

import { db } from '@/lib/prisma'
import { type UsersRepository } from '@/repositories/users-repository.interface'

export class PrismaUserRepository implements UsersRepository {
  findById(_userId: string): Promise<User | null> {
    throw new Error('Method not implemented.')
  }
  async create(data: Prisma.UserCreateInput): Promise<User> {
    return db.user.create({ data })
  }

  async findByEmail(email: string): Promise<User | null> {
    return db.user.findUnique({
      where: { email },
    })
  }
}
