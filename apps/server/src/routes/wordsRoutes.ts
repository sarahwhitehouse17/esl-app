import express from 'express'

import { getWords, createWord } from '../controllers/wordsController'

const router = express.Router()

router.get('/users/:userId/lessons/:lessonId/words', getWords)
router.post('/users/:userId/lessons/:lessonId/words', createWord)

export default router
