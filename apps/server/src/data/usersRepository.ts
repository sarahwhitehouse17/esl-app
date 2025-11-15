import prisma from '../prisma'

export const findUserByUsername = (username: string) => {
  return prisma.user.findUnique({
    where: { username },
  })
}

export const createUser = (username: string, hashedPassword: string) => {
  return prisma.user.create({
    data: { username, password: hashedPassword },
  })
}

export const findUserById = (userId: number) => {
  return prisma.user.findUnique({
    where: { id: userId },
  })
}
