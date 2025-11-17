import express from 'express'

import {
  getLesson,
  createLesson,
  getAllLessons,
} from '../controllers/lessonsController'

const router = express.Router()

router.get('/lessons', getAllLessons)

router.get('/lessons/:lessonId', getLesson) //should this not be /lessons/lessonId
router.post('/lessons', createLesson)

export default router
