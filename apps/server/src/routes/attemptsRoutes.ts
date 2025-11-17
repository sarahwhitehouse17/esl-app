import express from 'express'

import {
  getRemainingAttempts,
  getPassed,
  createAttempt,
} from '../controllers/attemptsController'

const router = express.Router()

router.get(
  '/lessons/:lessonId/attempts/remaining',
  getRemainingAttempts
)
router.get('/lessons/:lessonId/attempts/passed', getPassed)
router.post('/lessons/:lessonId/attempts', createAttempt)

export default router
