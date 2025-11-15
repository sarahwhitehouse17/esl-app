import { Request, Response } from 'express'
import * as goalsRepo from '../data/goalsRepository'
import { findUserById } from '../data/usersRepository'

export const getGoals = async (req: Request, res: Response) => {
  const userId = Number(req.params.userId)
  try {
    const user = await findUserById(userId)
    if (!user) {
      return res
        .status(404)
        .json({ error: 'User not found. Please try again.' })
    }
    const goals = await goalsRepo.findGoalsByUserId(userId)
    return res.status(200).json(goals)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Server error. Please try again.' })
  }
}

export const createGoal = async (req: Request, res: Response) => {
  const userId = Number(req.params.userId)
  const { goalTitle } = req.body

  try {
    if (!goalTitle) {
      return res.status(400).json({ error: 'Goal title is required.' })
    }
    const user = await findUserById(userId)
    if (!user) {
      return res.status(404).json({ error: 'No user found. Please try again.' })
    }

    const existingGoal = await goalsRepo.findGoalByTitleForUser(
      userId,
      goalTitle
    )

    if (existingGoal) {
      return res
        .status(400)
        .json({ error: 'This goal has already been selected' })
    }

    const count = await goalsRepo.countGoals(userId)

    if (count >= 3) {
      return res.status(400).json({ error: 'You can only select 3 goals' })
    }

    const goal = await goalsRepo.createGoal(userId, goalTitle)

    return res.status(201).json(goal)
  } catch (err) {
    console.error(err)
    return res
      .status(500)
      .json({ error: 'Unable to post goal. Please try again.' })
  }
}
