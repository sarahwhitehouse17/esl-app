import express from 'express'

import { getGoals, createGoal } from '../controllers/goalsController'

const router = express.Router()

router.get('/users/:userId/goals', getGoals)
router.post('/users/:userId/goals', createGoal)

export default router
