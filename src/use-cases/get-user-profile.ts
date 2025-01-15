import { type User } from '@prisma/client'

import { UsersRepository } from '@/repositories/users-repository.interface'

import { ResourceNotFoundError } from './errors/resource-not-found'

interface GetUserProfileUseCaseParams {
  userId: string
}

interface GetUserProfileUseCaseResponse {
  user: User
}

export class GetUserProfileUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
  }: GetUserProfileUseCaseParams): Promise<GetUserProfileUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) throw new ResourceNotFoundError()

    return { user }
  }
}
