import dotenv from 'dotenv'
dotenv.config()

import express, { Express, Request, Response, NextFunction } from 'express'
import { PrismaClient } from '@prisma/client'
import cors from 'cors'
import authController from './controllers/auth'
import cookieParser from 'cookie-parser'

const app: Express = express()
const prisma = new PrismaClient()

const port = 1337

const prodEnv = process.env.NODE_ENV || 'development'

app.use(
    cors({
        origin:
            prodEnv === 'development'
                ? 'http://localhost:1337'
                : 'https://backend.travelcheapwith.tech',
        credentials: true,
    })
)
app.use(express.json())
app.use(cookieParser())

app.use('/auth', authController)

app.get('/', (req: Request, res: Response) => {
    res.send({ message: 'pong' })
})

app.listen(port, () => {
    console.log(`Server is running at https://localhost:${port}`)
})
