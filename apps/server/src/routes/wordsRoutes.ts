import express from 'express'

import { getWords, createWord } from '../controllers/wordsController'

const router = express.Router()

router.get('/lessons/:lessonId/words', getWords)
router.post('/lessons/:lessonId/words', createWord)

export default router
