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

//   const lesson = await prisma.lesson.findFirst({
//     where: { userId, id },
//     include: {
//       words: true,
//     },
//   })

// app.get('/api/users/:userId/lessons/:id', async (req, res) => {
//   const userId = Number(req.params.userId)
//   const id = Number(req.params.id)

//prisma call in OG

// // const user = await prisma.user.findUnique({
//       where: { id: userId },
//     })

//finding a specific lesson:
//   const lesson = await prisma.lesson.create({
//     data: { userId, title },
//   })
