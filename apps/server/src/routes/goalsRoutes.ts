import express from 'express'

import { getGoals, createGoal } from '../controllers/goalsController'

const router = express.Router()

router.get('/goals', getGoals)
router.post('/goals', createGoal)

export default router
