import prisma from '../prisma'

export const createNewLesson = (userId: number, title: string) => {
  return prisma.lesson.create({
    data: { userId, title },
  })
}

export const getAllLessonsByUserId = (userId: number) => {
  return prisma.lesson.findMany({
    where: { userId },
    orderBy: { id: 'asc' }, // optional but nice
  })
}

export const getLessonByUserId = (userId: number, lessonId: number) => {
  return prisma.lesson.findFirst({
    where: { userId, id: lessonId },
    include: {
      words: true,
    },
  })
}
