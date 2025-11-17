import express from 'express'

import {
  getRemainingAttempts,
  getPassed,
  createAttempt,
} from '../controllers/attemptsController'

const router = express.Router()

router.get(
  '/users/:userId/lessons/:lessonId/attempts/remaining',
  getRemainingAttempts
)
router.get('/users/:userId/lessons/:lessonId/attempts/passed', getPassed)
router.post('/users/:userId/lessons/:lessonId/attempts', createAttempt)

export default router
