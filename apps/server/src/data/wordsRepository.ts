import prisma from '../prisma'

export const getWordsByLessonId = (lessonId: number) => {
  return prisma.word.findMany({
    where: { lessonId },
  })
}

export const createNewWord = (
  term: string,
  definition: string,
  lessonId: number
) => {
  return prisma.word.create({
    data: { term, definition, lessonId },
  })
}
