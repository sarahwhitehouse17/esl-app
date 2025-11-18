import express from 'express'

import {
  getRemainingAttempts,
  getPassed,
  createAttempt,
  getAttemptCountController,
} from '../controllers/attemptsController'

const router = express.Router()

router.get('/lessons/:lessonId/attempts/remaining', getRemainingAttempts)
router.get('/lessons/:lessonId/attempts/passed', getPassed)
router.post('/lessons/:lessonId/attempts', createAttempt)
router.get('/lessons/:lessonId/attempts/count', getAttemptCountController)

export default router
