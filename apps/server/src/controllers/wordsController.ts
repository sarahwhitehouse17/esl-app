import { Request, Response } from 'express'
import { getLessonByUserId } from '../data/lessonsRepository'
import * as WordsRepo from '../data/wordsRepository'
import { DEFAULT_LESSON_ID, DEFAULT_USER_ID } from '../defaultUser'

//app.get('/api/users/:userId/lessons/:lessonId/words',

export const getWords = async (req: Request, res: Response) => {
  const userId = DEFAULT_USER_ID
  const lessonId = DEFAULT_LESSON_ID

  try {
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
  const userId = DEFAULT_USER_ID
  const lessonId = DEFAULT_LESSON_ID
  const { term, definition } = req.body

  try {
    if (!term || !definition) {
      return res.status(400).json({ error: 'term or definition missing.' })
    }
    const lesson = await getLessonByUserId(userId, lessonId)

    if (!lesson) {
      return res.status(404).json({ error: 'lesson not found' })
    }

    const word = await WordsRepo.createNewWord(term, definition, lessonId)
    res.status(201).json(word)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Unable to save word. Please try again' })
  }
}
