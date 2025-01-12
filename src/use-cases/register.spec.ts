import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists'
import { RegisterUseCase } from '@/use-cases/register'
import { compare } from 'bcryptjs'

describe('USE CASE --> Register a user ', () => {
  it('should be able to register', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const passwordFake = '12345'
    const emailFake = 'johndoe@example.com'

    const { user } = await registerUseCase.execute({
      name: 'John Doe',
      email: emailFake,
      password: passwordFake,
    })

    expect(user.id).toBeString()
  })

  it('should hash user password upon registration', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const passwordFake = '12345'
    const emailFake = 'johndoe@example.com'

    const { user } = await registerUseCase.execute({
      name: 'John Doe',
      email: emailFake,
      password: passwordFake,
    })

    const isPasswordCorrectlyHashed = await compare(passwordFake, user.password_hash)

    expect(isPasswordCorrectlyHashed).toBeTrue()
  })

  it('should not be able to register with same email twice', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const passwordFake = '12345'
    const emailFake = 'johndoe@example.com'

    await registerUseCase.execute({
      name: 'John Doe',
      email: emailFake,
      password: passwordFake,
    })

    await expect(
      registerUseCase.execute({
        name: 'John Doe',
        email: emailFake,
        password: passwordFake,
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
