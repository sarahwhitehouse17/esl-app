import express, { Express } from 'express'
import usersRoutes from './routes/usersRoutes'
import goalsRoutes from './routes/goalsRoutes'
import lessonsRoutes from './routes/lessonsRoutes'
import wordsRoutes from './routes/wordsRoutes'
import attemptsRoutes from './routes/attemptsRoutes'
import cors from 'cors'

import dotenv from 'dotenv'
dotenv.config()

const PORT = Number(process.env.PORT) || 8080
const app: Express = express()
app.use(cors())
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

// app.listen(PORT, () => {
//   console.log(`🚀 Server is running on http://localhost:${PORT}`)
// })

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`)
})
