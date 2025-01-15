import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists'
import { RegisterUseCase } from '@/use-cases/register'

let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase

describe('USE CASE --> Register a user ', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUseCase(usersRepository)
  })

  it('should be able to register', async () => {
    const passwordFake = '12345'
    const emailFake = 'johndoe@example.com'

    const { user } = await sut.execute({
      name: 'John Doe',
      email: emailFake,
      password: passwordFake,
    })

    expect(user.id).toBeString()
  })

  it('should hash user password upon registration', async () => {
    const passwordFake = '12345'
    const emailFake = 'johndoe@example.com'

    const { user } = await sut.execute({
      name: 'John Doe',
      email: emailFake,
      password: passwordFake,
    })

    const isPasswordCorrectlyHashed = await compare(passwordFake, user.password_hash)

    expect(isPasswordCorrectlyHashed).toBeTrue()
  })

  it('should not be able to register with same email twice', async () => {
    const passwordFake = '12345'
    const emailFake = 'johndoe@example.com'

    await sut.execute({
      name: 'John Doe',
      email: emailFake,
      password: passwordFake,
    })

    await expect(
      sut.execute({
        name: 'John Doe',
        email: emailFake,
        password: passwordFake,
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
