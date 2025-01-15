import { hash } from 'bcryptjs'

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { GetUserProfileUseCase } from '@/use-cases/get-user-profile'

import { ResourceNotFoundError } from './errors/resource-not-found'

let usersRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase

describe('USE CASE --> Get a user ', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileUseCase(usersRepository)
  })

  it('should be able to get user profile', async () => {
    const nameFake = 'John Doe'
    const emailFake = 'johndoe@example.com'

    const userCreated = await usersRepository.create({
      name: nameFake,
      email: emailFake,
      password_hash: await hash('12345', 6),
    })

    const { user } = await sut.execute({ userId: userCreated.id })

    expect(userCreated.id).toString()
    expect(user.name).toEqual(nameFake)
    expect(user.email).toEqual(emailFake)
  })

  it('should not be able to get user profile with wrong id', async () => {
    await expect(sut.execute({ userId: 'non-existing-id' })).rejects.toBeInstanceOf(
      ResourceNotFoundError,
    )
  })
})
