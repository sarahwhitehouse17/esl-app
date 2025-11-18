import prisma from '../prisma'

export const checkCount = (userId: number, lessonId: number) => {
  return prisma.attempt.count({
    where: { userId, lessonId },
  })
}

export const createAttempt = (
  userId: number,
  lessonId: number,
  attemptNum: number,
  correct: boolean,
  answers: object
) => {
  return prisma.attempt.create({
    data: { userId, lessonId, attemptNum, correct, answers },
  })
}

export const getPassedCount = (userId: number, lessonId: number) => {
  return prisma.attempt.count({
    where: {
      userId,
      lessonId,
      correct: true,
    },
  })
}

export const getAttemptCount = (userId: number, lessonId: number) => {
  return prisma.attempt.count({
    where: { userId, lessonId },
  })
}
