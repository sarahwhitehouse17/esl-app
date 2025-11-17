import express, { Express } from 'express'
import usersRoutes from './routes/usersRoutes'
import goalsRoutes from './routes/goalsRoutes'
import lessonsRoutes from './routes/lessonsRoutes'
import wordsRoutes from './routes/wordsRoutes'
import prisma from './prisma'

import dotenv from 'dotenv'
dotenv.config()

const PORT = process.env.PORT || 8080
const app: Express = express()
app.use(express.json())

//USERS

app.use('/api', usersRoutes)

//WORDS

app.use('/api', wordsRoutes)


//LESSONS

app.use('/api', lessonsRoutes)

//GOALS

app.use('/api', goalsRoutes)

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
