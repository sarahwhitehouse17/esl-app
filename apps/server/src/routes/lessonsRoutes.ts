import express from 'express'

import { getLesson, createLesson } from '../controllers/lessonsController'

const router = express.Router()

router.get('/users/:userId/lessons/:id', getLesson)
router.post('/users/:userId/lessons', createLesson)

export default router
