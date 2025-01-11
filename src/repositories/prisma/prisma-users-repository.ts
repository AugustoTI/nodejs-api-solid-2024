import { db } from '@/lib/prisma'
import { type Prisma, type User } from '@prisma/client'
import { type UsersRepository } from '@/repositories/interfaces/users-repository'

export class PrismaUserRepository implements UsersRepository {
  async create(data: Prisma.UserCreateInput): Promise<User> {
    return db.user.create({ data })
  }

  async findByEmail(email: string): Promise<User | null> {
    return db.user.findUnique({
      where: { email },
    })
  }
}
