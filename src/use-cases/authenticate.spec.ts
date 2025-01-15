import { hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from '@/use-cases/authenticate'
import { InvalidCredentialsError } from './errors/invalid-credentials'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe('USE CASE --> Authenticate a user ', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUseCase(usersRepository)
  })

  it('should be able to authenticate', async () => {
    const passwordFake = '12345'
    const emailFake = 'johndoe@example.com'

    await usersRepository.create({
      name: 'John Doe',
      email: emailFake,
      password_hash: await hash(passwordFake, 6),
    })

    const { user } = await sut.execute({
      email: emailFake,
      password: passwordFake,
    })

    expect(user.id).toBeString()
  })

  it('should not be able to authenticate with wrong email', async () => {
    await expect(
      sut.execute({
        email: 'johndoe@example.com',
        password: '12345',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    const passwordFake = '12345'
    const emailFake = 'johndoe@example.com'

    await usersRepository.create({
      name: 'John Doe',
      email: emailFake,
      password_hash: await hash(passwordFake, 6),
    })

    await expect(
      sut.execute({
        email: emailFake,
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
