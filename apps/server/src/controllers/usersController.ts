import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import * as userRepo from '../data/usersRepository'

//USERS

export const getUserByUsername = async (req: Request, res: Response) => {
  const { username } = req.params

  try {
    const user = await userRepo.findUserByUsername(username)

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    return res.status(200).json(user)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Server error, please try again' })
  }
}

export const createUser = async (req: Request, res: Response) => {
  const { username, password } = req.body

  try {
    if (
      !username ||
      username.trim().length < 4 ||
      !password ||
      password.trim().length < 4
    ) {
      return res
        .status(400)
        .json({ error: 'Username and password are required fields.' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await userRepo.createUser(username, hashedPassword)
    return res.status(201).json(user)
  } catch (err: unknown) {
    console.error(err)
    res.status(500).json({ error: 'Server error. Please try again' })
  }
}
