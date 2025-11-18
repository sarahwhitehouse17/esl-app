import { Request, Response } from 'express'
import { DEFAULT_USER_ID } from '../defaultUser'
import { getLessonByUserId } from '../data/lessonsRepository'
import * as AttemptsRepo from '../data/attemptsRepository'

//getAttempts //createAttmpt

// app.post('/api/users/:userId/lessons/:lessonId/attempts',

export const createAttempt = async (req: Request, res: Response) => {
  const userId = DEFAULT_USER_ID
  const lessonId = Number(req.params.lessonId)
  const { correct, answers } = req.body

  console.log('Checking', { userId, lessonId, correct })
  try {
    if (typeof correct !== 'boolean') {
      return res
        .status(400)
        .json({ error: `Field 'correct' must be true or false.` })
    }

    const lesson = await getLessonByUserId(userId, lessonId)

    if (!lesson) {
      return res.status(404).json({ error: 'Lesson for this user not found.' })
    }

    const count = await AttemptsRepo.checkCount(userId, lessonId)

    if (count >= 3) {
      return res
        .status(400)
        .json({ error: 'Maximum number of attempts reached' })
    }

    const attempt = await AttemptsRepo.createAttempt(
      userId,
      lessonId,
      count + 1,
      correct,
      answers
    )
    return res.status(201).json(attempt)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'server error' })
  }
}

export const getPassed = async (req: Request, res: Response) => {
  const userId = DEFAULT_USER_ID
  const lessonId = Number(req.params.lessonId)

  try {
    const lesson = await getLessonByUserId(userId, lessonId)

    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found for this user' })
    }

    const passedCount = await AttemptsRepo.getPassedCount(userId, lessonId)

    return res.status(200).json({ passed: passedCount > 0 })
  } catch (err) {
    console.error(err)
    return res.status(500).json({
      error: 'Error connecting to the server. Please try again.',
    })
  }
}

// app.get(
//   '/api/users/:userId/lessons/:lessonId/attempts/remaining',

export const getRemainingAttempts = async (req: Request, res: Response) => {
  const userId = DEFAULT_USER_ID
  const lessonId = Number(req.params.lessonId)

  try {
    const lesson = await getLessonByUserId(userId, lessonId)

    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found for this user.' })
    }

    const count = await AttemptsRepo.getAttemptCount(userId, lessonId)

    const remaining = Math.max(0, 3 - count)
    return res.status(200).json({ remaining })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Server error. Please try again.' })
  }
}

export const getAttemptCountController = async (
  req: Request,
  res: Response
) => {
  const userId = DEFAULT_USER_ID
  const lessonId = Number(req.params.lessonId)

  try {
    const count = await AttemptsRepo.getAttemptCount(userId, lessonId)
    return res.status(200).json({ attemptCount: count })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Error fetching attempt count' })
  }
}
