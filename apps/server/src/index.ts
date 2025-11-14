import express, { Express, Request, Response } from 'express'
import prisma from './prisma'
import bcrypt from 'bcrypt'

import dotenv from 'dotenv'
dotenv.config()

const PORT = process.env.PORT || 8080
const app: Express = express()
app.use(express.json())

//USERS

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

//WORDS

app.get('/api/users/:username/lessons/:id/words', async (req, res) => {
  const lessonId = Number(req.params.id)
  const words = await prisma.word.findMany({
    where: { lessonId },
  })
  res.json(words)
})

app.post('/api/users/:username/lessons/:id/words', async (req, res) => {
  const lessonID = Number(req.params.id)
  const { term, definition } = req.body

  const word = await prisma.word.create({
    data: { term, definition, lessonID },
  })
  res.json(word)
})

//LESSONS

app.post('/api/users/:username/lessons', async (req, res) => {
  const { title } = req.body

  const lesson = await prisma.lesson.create({
    data: { title },
  })
  res.json(lesson)
})

app.get('/api/users/:username/lessons/:id', async (req, res) => {
  const id = Number(req.params.id)

  const lesson = await prisma.lesson.findUnique({
    where: { id },
    include: {
      words: true,
    },
  })
  res.json(lesson)
})

//GOALS

app.get('/api/users/:username/goals', async (req, res) => {
  const { username } = req.params

  const goals = await prisma.goal.findMany({
    where: { username },
  })
  res.json(goals)
})

app.post('/api/users/:username/goals', async (req, res) => {
  console.log('POST ROUTE REACHED')
  const { username } = req.params
  const { goalTitle } = req.body

  const goal = await prisma.goal.create({
    data: { username, goalTitle },
  })
  res.json(goal)
})

app.post('/api/users/:username/lessons/:id/attempts', async (req, res) => {
  const { username } = req.params
  const { wordId, correct } = req.body

  const attempt = await prisma.attempt.create({
    data: {
      username,
      wordId,
      correct,
    },
  })
  res.json(attempt)
})

app.get('/api/users/:username/lessons/:id/attempts', async (req, res) => {
  const { username } = req.params

  const attempt = await prisma.attempt.findMany({
    where: { username },
  })
  res.json(attempt)
})

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`)
})
