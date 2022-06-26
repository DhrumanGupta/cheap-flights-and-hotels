import dotenv from 'dotenv'
dotenv.config()

import express, { Express, Request, Response, NextFunction } from 'express'
import cors from 'cors'
import authController from './controllers/auth'
import cookieParser from 'cookie-parser'
import runWorkerTask from './worker'
import cron from 'node-cron'

const app: Express = express()

const port = 1337

const prodEnv = process.env.NODE_ENV || 'development'

app.use(
    cors({
        origin:
            prodEnv === 'development'
                ? `http://localhost:${port}`
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

runWorkerTask().then()

// cron.schedule('*/5 0 * * *', async () => await runWorkerTask())
