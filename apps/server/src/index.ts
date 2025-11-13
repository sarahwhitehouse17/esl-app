import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'
dotenv.config()

const PORT = process.env.PORT || 8080
const app: Express = express()

app.get('/', (_: Request, res: Response) => {
  res.send('Express + TypeScript Server')
})

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`)
})
