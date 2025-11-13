import express, { Express, Request, Response } from 'express'
import prisma from './prisma'
import bcrypt from 'bcrypt'

import dotenv from 'dotenv'
dotenv.config()

const PORT = process.env.PORT || 8080
const app: Express = express()
app.use(express.json())

//users methods

app.get('/api/users/:username', async (req, res) => {
  const { username } = req.params

  const user = await prisma.user.findUnique({
    where: { username },
  })
  res.json(user)
})

app.post('/api/users', async (req, res) => {
  const { username, password } = req.body

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: { username, password: hashedPassword },
  })
  res.json(user)
})

app.get('/', (_: Request, res: Response) => {
  // res.send('Express + TypeScript Server')
})

app.get('/api/words', async (req, res) => {
  const words = await prisma.word.findMany()
  res.json(words)
})

app.get('/api/goals', (req, res) => {
  // res.json(goals)
})

app.post('/api/goals', (req, res) => {
  // res.json(req.body)
})

app.post('/api/attempts', (req, res) => {
  // res.json(attempts)
})

app.get('/api/attempts', (req, res) => {
  // res.json(attempts)
})

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`)
})
