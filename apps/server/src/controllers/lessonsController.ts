import { Request, Response } from 'express'
import { findUserById } from '../data/usersRepository'
import * as lessonsRepo from '../data/lessonsRepository'

export const createLesson = async (req: Request, res: Response) => {
  const userId = Number(req.params.userId)
  const { title } = req.body
  try {
    if (!title || title.trim().length === 0) {
      return res.status(400).json({ error: 'Lesson title cannot be empty' })
    }

    const user = await findUserById(userId)
    if (!user) {
      return res
        .status(404)
        .json({ error: 'User not found. Please try again.' })
    }
    const lesson = await lessonsRepo.createNewLesson(userId, title)
    res.status(201).json(lesson)
  } catch {
    res.status(500).json({ error: 'Unable to find data' })
  }
}

export const getLesson = async (req: Request, res: Response) => {
  const userId = Number(req.params.userId)
  const id = Number(req.params.id)

  try {
    const user = await findUserById(userId)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const lesson = await lessonsRepo.getLessonByUserId(userId, id)

    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found for this user' })
    }

    res.status(200).json(lesson)
  } catch {
    res.status(500).json({
      error: 'Unable to load this data. Please check user and lesson ID',
    })
  }
}
