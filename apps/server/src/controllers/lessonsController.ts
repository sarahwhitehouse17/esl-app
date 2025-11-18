import { Request, Response } from 'express'
import * as lessonsRepo from '../data/lessonsRepository'
import { DEFAULT_USER_ID } from '../defaultUser'

export const createLesson = async (req: Request, res: Response) => {
  const userId = DEFAULT_USER_ID
  const { title } = req.body
  try {
    if (!title || title.trim().length === 0) {
      return res.status(400).json({ error: 'Lesson title cannot be empty' })
    }

    const lesson = await lessonsRepo.createNewLesson(userId, title)
    res.status(201).json(lesson)
  } catch {
    res.status(500).json({ error: 'Unable to find data' })
  }
}

export const getAllLessons = async (req: Request, res: Response) => {
  const userId = DEFAULT_USER_ID

  try {
    const lessons = await lessonsRepo.getAllLessonsByUserId(userId)
    return res.status(200).json(lessons)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Unable to fetch lessons.' })
  }
}

export const getLesson = async (req: Request, res: Response) => {
  const userId = DEFAULT_USER_ID
  const lessonId = Number(req.params.lessonId)

  try {
    const lesson = await lessonsRepo.getLessonByUserId(userId, lessonId)

    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' })
    }

    res.status(200).json(lesson)
  } catch {
    res.status(500).json({
      error: 'Unable to load this lesson. Please try again',
    })
  }
}
