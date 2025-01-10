import { db } from '@/lib/prisma'
import { PrismaUserRepository } from '@/repositories/prisma-users-repository'
import { hash } from 'bcryptjs'

interface RegisterUseCaseParams {
  name: string
  email: string
  password: string
}

export async function registerUseCase({ name, email, password }: RegisterUseCaseParams) {
  const password_hash = await hash(password, 6)

  const userWithSameEmail = await db.user.findUnique({
    where: { email },
  })

  if (userWithSameEmail) throw new Error('E-Mail already exists.')

  const prismaUserRepository = new PrismaUserRepository()

  await prismaUserRepository.create({ name, email, password_hash })
}
