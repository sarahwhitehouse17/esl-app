import express from 'express'

import { createUser, getUserByUsername } from '../controllers/usersController'

const router = express.Router()

router.post('/users', createUser)
router.get('/users/:username', getUserByUsername)

export default router
