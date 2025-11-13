import express, { Express, Request, Response } from 'express'
import words from './mock/words.json'
import goals from './mock/goals.json'
import users from './mock/users.json'
import attempts from './mock/attempts.json'

import dotenv from 'dotenv'
dotenv.config()

const PORT = process.env.PORT || 8080
const app: Express = express()
app.use(express.json())

app.get('/', (_: Request, res: Response) => {
  res.send('Express + TypeScript Server')
})

app.get('/api/words', (req, res) => {
  res.json(words)
})

app.get('/api/users', (req, res) => {
  res.json(users)
})

app.get('/api/goals', (req, res) => {
  res.json(goals)
})

app.post('/api/goals', (req, res) => {
  res.json(req.body)
})

app.post('/api/attempts', (req, res) => {
  res.json(attempts)
})

app.get('/api/attempts', (req, res) => {
  res.json(attempts)
})

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`)
})
