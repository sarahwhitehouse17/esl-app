import prisma from '../prisma'

export const findGoalsByUserId = (userId: number) => {
  return prisma.goal.findMany({
    where: { userId },
  })
}

export const createGoal = (userId: number, goalTitle: string) => {
  return prisma.goal.create({
    data: { userId, goalTitle },
  })
}
export const countGoals = (userId: number) => {
  return prisma.goal.count({
    where: { userId },
  })
}

export const findGoalByTitleForUser = (userId: number, goalTitle: string) => {
  return prisma.goal.findFirst({
    where: { userId, goalTitle },
  })
}
