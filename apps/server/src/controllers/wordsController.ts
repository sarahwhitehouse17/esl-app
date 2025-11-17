import { Request, Response } from 'express'
import { findUserById } from '../data/usersRepository'
import { getLessonByUserId } from '../data/lessonsRepository'
import * as WordsRepo from '../data/wordsRepository'

//app.get('/api/users/:userId/lessons/:lessonId/words',

export const getWords = async (req: Request, res: Response) => {
  const userId = Number(req.params.userId)
  const lessonId = Number(req.params.lessonId)

  try {
    const user = await findUserById(userId)
    if (!user) {
      return res
        .status(404)
        .json({ error: 'User not found. Please try again.' })
    }
    const lesson = await getLessonByUserId(userId, lessonId)

    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found for this user' })
    }

    const words = await WordsRepo.getWordsByLessonId(lessonId)
    res.status(200).json(words)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'server error' })
  }
}

//app.post('/api/users/:userId/lessons/:lessonId/words',
export const createWord = async (req: Request, res: Response) => {
  const userId = Number(req.params.userId)
  const lessonId = Number(req.params.lessonId)
  const { term, definition } = req.body

  try {
    if (!term || !definition) {
      return res.status(400).json({ error: 'term or definition missing.' })
    }

    const user = await findUserById(userId)

    if (!user) {
      return res.status(404).json({ error: 'No user or lesson found' })
    }

    const lesson = await getLessonByUserId(userId, lessonId)

    if (!lesson) {
      return res.status(404).json({ error: 'lesson not found' })
    }

    const word = await WordsRepo.createNewWord(term, definition, lessonId)
    res.status(201).json(word)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Unable to find data' })
  }
}
