import express, { Express, Request, Response } from 'express'
import prisma from './prisma'
import bcrypt from 'bcrypt'

import dotenv from 'dotenv'
dotenv.config()

const PORT = process.env.PORT || 8080
const app: Express = express()
app.use(express.json())

//USERS

app.get('/api/users/:username', async (req, res) => {
  const { username } = req.params

  const user = await prisma.user.findUnique({
    where: { username },
  })
  res.json(user)
})

app.post('/api/users', async (req, res) => {
  const { username, password } = req.body

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: { username, password: hashedPassword },
  })
  res.json(user)
})

app.get('/', (_: Request, res: Response) => {
  res.send('Express + TypeScript Server')
})

//WORDS

app.get('/api/users/:userId/lessons/:lessonId/words', async (req, res) => {
  const userId = Number(req.params.userId)
  const lessonId = Number(req.params.lessonId)

  const lesson = await prisma.lesson.findFirst({
    where: { id: lessonId, userId },
  })

  if (!lesson) {
    return res.status(404).json({ error: 'Lesson not found' })
  }

  const words = await prisma.word.findMany({
    where: { lessonId },
  })
  res.json(words)
})

app.post('/api/users/:userId/lessons/:lessonId/words', async (req, res) => {
  const userId = Number(req.params.userId)
  const lessonId = Number(req.params.lessonId)
  const { term, definition } = req.body

  const lesson = await prisma.lesson.findFirst({
    where: { id: lessonId, userId },
  })

  if (!lesson) {
    return res.status(404).json({ error: 'lesson not found' })
  }

  const word = await prisma.word.create({
    data: { term, definition, lessonId },
  })
  res.json(word)
})

//LESSONS

app.post('/api/users/:userId/lessons', async (req, res) => {
  const userId = Number(req.params.userId)
  const { title } = req.body

  const lesson = await prisma.lesson.create({
    data: { userId, title },
  })
  res.json(lesson)
})

app.get('/api/users/:userId/lessons/:id', async (req, res) => {
  const userId = Number(req.params.userId)
  const id = Number(req.params.id)

  const lesson = await prisma.lesson.findFirst({
    where: { userId, id },
    include: {
      words: true,
    },
  })
  res.json(lesson)
})

app.get('/api/users/:userId/goals', async (req, res) => {
  const userId = Number(req.params.userId)

  const goals = await prisma.goal.findMany({
    where: { userId },
  })
  res.json(goals)
})

app.post('/api/users/:userId/goals', async (req, res) => {
  console.log('POST ROUTE REACHED')
  const userId = Number(req.params.userId)
  const { goalTitle } = req.body

  const goal = await prisma.goal.create({
    data: { userId, goalTitle },
  })
  res.json(goal)
})

//attempts

app.post('/api/users/:userId/lessons/:lessonId/attempts', async (req, res) => {
  const userId = Number(req.params.userId)
  const lessonId = Number(req.params.lessonId)
  const { correct } = req.body

  try {
    const count = await prisma.attempt.count({
      where: { userId, lessonId },
    })

    if (count >= 3) {
      return res
        .status(400)
        .json({ error: 'Maximum number of attempts reached' })
    }

    const attemptNum = count + 1

    const attempt = await prisma.attempt.create({
      data: {
        userId,
        lessonId,
        attemptNum,
        correct,
      },
    })
    res.json(attempt)
  } catch {
    res.status(500).json({ error: 'server error' })
  }
})

app.get(
  '/api/users/:userId/lessons/:lessonId/attempts/passed',
  async (req, res) => {
    const userId = Number(req.params.userId)
    const lessonId = Number(req.params.lessonId)

    const passed = await prisma.attempt.findFirst({
      where: { userId, lessonId, correct: true },
      orderBy: { attemptNum: 'asc' },
    })
    res.json({ passed: Boolean(passed) })
  }
)

app.get(
  '/api/users/:userId/lessons/:lessonId/attempts/remaining',
  async (req, res) => {
    const userId = Number(req.params.userId)
    const lessonId = Number(req.params.lessonId)

    const count = await prisma.attempt.count({
      where: { userId, lessonId },
    })
    const remaining = Math.max(0, 3 - count)
    res.json({ remaining })
  }
)

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`)
})
