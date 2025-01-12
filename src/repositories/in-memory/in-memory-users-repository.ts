import { type Prisma, type User } from '@prisma/client'
import { UsersRepository } from '../users-repository.interface'

export class InMemoryUsersRepository implements UsersRepository {
  private usersRepository: User[] = []

  async create(data: Prisma.UserCreateInput): Promise<User> {
    const user = {
      id: 'user-id',
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created_at: new Date(),
    }

    this.usersRepository.push(user)

    return user
  }
  async findByEmail(email: string): Promise<User | null> {
    const result = this.usersRepository.find(user => user.email === email)

    return result ? result : null
  }
}
