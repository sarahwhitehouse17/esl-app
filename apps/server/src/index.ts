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

  try {
    const user = await prisma.user.findUnique({
      where: { username },
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    return res.status(200).json(user)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Server error, please try again' })
  }
})

app.post('/api/users', async (req, res) => {
  const { username, password } = req.body

  try {
    if (
      !username ||
      username.trim().length < 4 ||
      !password ||
      password.trim().length < 4
    ) {
      return res
        .status(400)
        .json({ error: 'Username and password are required fields.' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: { username, password: hashedPassword },
    })
    return res.status(201).json(user)
  } catch (err: unknown) {
    console.error(err)
    res.status(500).json({ error: 'Server error. Please try again' })
  }
})

app.get('/', (_: Request, res: Response) => {
  res.send('Express + TypeScript Server')
})

//WORDS

app.get('/api/users/:userId/lessons/:lessonId/words', async (req, res) => {
  const userId = Number(req.params.userId)
  const lessonId = Number(req.params.lessonId)

  try {
    const lesson = await prisma.lesson.findFirst({
      where: { id: lessonId, userId },
    })

    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found for this user' })
    }

    const words = await prisma.word.findMany({
      where: { lessonId },
    })
    res.status(200).json(words)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'server error' })
  }
})

app.post('/api/users/:userId/lessons/:lessonId/words', async (req, res) => {
  const userId = Number(req.params.userId)
  const lessonId = Number(req.params.lessonId)
  const { term, definition } = req.body

  try {
    if (!term || !definition) {
      return res.status(400).json({ error: 'term or definition missing.' })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return res.status(404).json({ error: 'No user or lesson found' })
    }

    const lesson = await prisma.lesson.findFirst({
      where: { id: lessonId, userId },
    })

    if (!lesson) {
      return res.status(404).json({ error: 'lesson not found' })
    }

    const word = await prisma.word.create({
      data: { term, definition, lessonId },
    })
    res.status(201).json(word)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Unable to find data' })
  }
})

//LESSONS

app.post('/api/users/:userId/lessons', async (req, res) => {
  const userId = Number(req.params.userId)
  const { title } = req.body

  try {
    if (!title || title.trim().length === 0) {
      return res.status(400).json({ error: 'Lesson title cannot be empty' })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    const lesson = await prisma.lesson.create({
      data: { userId, title },
    })
    res.status(201).json(lesson)
  } catch {
    res.status(500).json({ error: 'Unable to find data' })
  }
})

app.get('/api/users/:userId/lessons/:id', async (req, res) => {
  const userId = Number(req.params.userId)
  const id = Number(req.params.id)

  try {
    const lesson = await prisma.lesson.findFirst({
      where: { userId, id },
      include: {
        words: true,
      },
    })
    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found for this user' })
    }

    res.status(200).json(lesson)
  } catch {
    res.status(500).json({
      error: 'Unable to load this data. Please check user and lesson ID',
    })
  }
})

app.get('/api/users/:userId/goals', async (req, res) => {
  const userId = Number(req.params.userId)

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return res
        .status(404)
        .json({ error: 'User not found. Please try again.' })
    }
    const goals = await prisma.goal.findMany({
      where: { userId },
    })
    return res.status(200).json(goals)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Server error. Please try again.' })
  }
})

app.post('/api/users/:userId/goals', async (req, res) => {
  const userId = Number(req.params.userId)
  const { goalTitle } = req.body

  try {
    if (!goalTitle) {
      return res.status(400).json({ error: 'Goal title is required.' })
    }
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })
    if (!user) {
      return res.status(404).json({ error: 'No user found. Please try again.' })
    }

    const existingGoal = await prisma.goal.findFirst({
      where: { userId, goalTitle },
    })
    if (existingGoal) {
      return res
        .status(400)
        .json({ error: 'This goal has already been selected' })
    }

    const count = await prisma.goal.count({
      where: { userId },
    })

    if (count >= 3) {
      return res.status(400).json({ error: 'You can only select 3 goals' })
    }

    const goal = await prisma.goal.create({
      data: { userId, goalTitle },
    })

    return res.status(201).json(goal)
  } catch (err) {
    console.error(err)
    return res
      .status(500)
      .json({ error: 'Unable to post goal. Please try again.' })
  }
})

//attempts

app.post('/api/users/:userId/lessons/:lessonId/attempts', async (req, res) => {
  const userId = Number(req.params.userId)
  const lessonId = Number(req.params.lessonId)
  const { correct } = req.body

  try {
    if (typeof correct !== 'boolean') {
      return res
        .status(400)
        .json({ error: `Field 'correct' must be true or false.` })
    }
    const lesson = await prisma.lesson.findFirst({
      where: { id: lessonId, userId },
    })

    if (!lesson) {
      return res.status(404).json({ error: 'Lesson for this user not found.' })
    }

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
    return res.status(201).json(attempt)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'server error' })
  }
})

app.get(
  '/api/users/:userId/lessons/:lessonId/attempts/passed',
  async (req, res) => {
    const userId = Number(req.params.userId)
    const lessonId = Number(req.params.lessonId)

    try {
      const lesson = await prisma.lesson.findFirst({
        where: { id: lessonId, userId },
      })

      if (!lesson) {
        return res.status(404).json({ error: 'Lesson not found for this user' })
      }
      const passedAttempt = await prisma.attempt.findFirst({
        where: { userId, lessonId, correct: true },
      })

      const hasPassed = Boolean(passedAttempt)

      return res.status(200).json({ passed: hasPassed })
    } catch (err) {
      console.error(err)
      return res.status(500).json({
        error: 'Error connecting to the server. Please try again.',
      })
    }
  }
)

app.get(
  '/api/users/:userId/lessons/:lessonId/attempts/remaining',
  async (req, res) => {
    const userId = Number(req.params.userId)
    const lessonId = Number(req.params.lessonId)

    try {
      const lesson = await prisma.lesson.findFirst({
        where: { id: lessonId, userId },
      })

      if (!lesson) {
        return res
          .status(404)
          .json({ error: 'Lesson not found for this user.' })
      }

      const count = await prisma.attempt.count({
        where: { userId, lessonId },
      })
      const remaining = Math.max(0, 3 - count)
      return res.status(200).json({ remaining })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: 'Server error. Please try again.' })
    }
  }
)

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`)
})
