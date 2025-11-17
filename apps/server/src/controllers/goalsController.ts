import { Request, Response } from 'express'
import * as goalsRepo from '../data/goalsRepository'
import { DEFAULT_USER_ID } from '../defaultUser'

export const getGoals = async (req: Request, res: Response) => {
  const userId = DEFAULT_USER_ID
  try {
    const goals = await goalsRepo.findGoalsByUserId(userId)
    return res.status(200).json(goals)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Server error. Please try again.' })
  }
}

export const createGoal = async (req: Request, res: Response) => {
  const userId = DEFAULT_USER_ID
  const { goalTitle } = req.body

  try {
    if (!goalTitle) {
      return res.status(400).json({ error: 'Goal title is required.' })
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
