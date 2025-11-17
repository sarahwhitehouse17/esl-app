import express, { Express } from 'express'
import usersRoutes from './routes/usersRoutes'
import goalsRoutes from './routes/goalsRoutes'
import lessonsRoutes from './routes/lessonsRoutes'
import wordsRoutes from './routes/wordsRoutes'
import attemptsRoutes from './routes/attemptsRoutes'

import dotenv from 'dotenv'
dotenv.config()

const PORT = process.env.PORT || 8080
const app: Express = express()
app.use(express.json())

//USERS

app.use('/api', usersRoutes)

//WORDS

app.use('/api', wordsRoutes)

//LESSONS

app.use('/api', lessonsRoutes)

//GOALS

app.use('/api', goalsRoutes)

//attempts

app.use('/api', attemptsRoutes)

app.get('/', (req, res) => {
  res.send('API is running...')
})

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`)
})
