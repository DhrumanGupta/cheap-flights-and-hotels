import { Router, Request, Response } from 'express'
import crypto from 'crypto'
import twilio from 'twilio'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import authenticateUser from '../middleware/authenticateUser'
import { sendMessage } from '../services/twilio'

const prisma = new PrismaClient()

const router = Router()

const jwtAuthToken = process.env.JWT_AUTH_TOKEN || ''
const jwtRefreshToken = process.env.JWT_REFRESH_TOKEN || ''
const smsKey = process.env.SMS_SECRET_KEY || ''

const refreshTokens: string[] = []

router.post('/sendOTP', (req: Request, res: Response) => {
    if (!req.body?.phone) {
        res.status(400).send({ message: 'Invalid parameters provided' })
        return
    }

    const phone = req.body.phone
    const otp = Math.floor(100000 + Math.random() * 900000)
    const ttl = 5 * 60 * 1000
    const expires = Date.now() + ttl
    const data = `${phone}.${otp}.${expires}`
    const hash = crypto.createHmac('sha256', smsKey).update(data).digest('hex')
    const fullHash = `${hash}.${expires}`

    sendMessage(
        phone,
        `Your One Time Password (OTP) for Travel Cheap is ${otp}`
    ).catch(console.error)

    res.status(200).send({ phone, hash: fullHash })
})

router.post('/refresh', (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) {
        res.status(403).send({ message: 'Refresh Token not Found' })
        return
    }

    if (!refreshTokens.includes(refreshToken)) {
        res.status(403).send({ message: 'Refresh Token Blocked' })
        return
    }

    jwt.verify(refreshToken, jwtRefreshToken, async (err: any, phone: any) => {
        if (!err) {
            const accessToken = jwt.sign({ data: phone }, jwtAuthToken, {
                expiresIn: '1d',
            })

            res.status(202)
                .cookie('accessToken', accessToken, {
                    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
                    sameSite: 'strict',
                    httpOnly: true,
                })
                .send({ previousSessionExpired: true, success: true })

            return
        }

        res.status(403).send({
            success: false,
            message: 'Invalid Refresh Token',
        })
    })
})

router.post('/verifyOTP', async (req: Request, res: Response) => {
    const phone: string = req.body.phone
    const hash = req.body.hash
    const otp = req.body.otp
    const [hashValue, expires] = hash.split('.')

    if (!phone || !hash || !otp) {
        return res.status(400).send({ message: 'Invalid parameters provided' })
    }

    if (Date.now() > parseInt(expires)) {
        res.status(504).send({
            message: 'OTP has timed out, please try again',
        })
        return
    }

    const data = `${phone}.${otp}.${expires}`
    const calculatedHash = crypto
        .createHmac('sha256', smsKey)
        .update(data)
        .digest('hex')
    if (calculatedHash !== hashValue) {
        res.status(400).send({ message: 'Invalid OTP provided' })
        return
    }

    const accessToken = jwt.sign({ data: phone }, jwtAuthToken, {
        expiresIn: '1d',
    })
    const refreshToken = jwt.sign({ data: phone }, jwtRefreshToken, {
        expiresIn: '1y',
    })
    refreshTokens.push(refreshToken)

    try {
        const user = await prisma.user.findFirst({ where: { phone } })
        if (!user) {
            await prisma.user.create({ data: { phone } })
        }
    } catch (err) {
        console.log(err)
    }

    res.status(202)
        .cookie('accessToken', accessToken, {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            sameSite: 'strict',
            httpOnly: true,
        })
        .cookie('refreshToken', refreshToken, {
            expires: new Date(31557600000), // 1 year
            sameSite: 'strict',
            httpOnly: true,
        })
        .send({ message: 'Logged in successfully' })
})

router.post('/logout', async (req: Request, res: Response) => {
    res.clearCookie('refreshToken')
        .clearCookie('accessToken')
        .send({ message: 'User Logged Out' })
})

router.get('/user', authenticateUser, async (req: Request, res: Response) => {
    // @ts-ignore
    const phone = req.phone

    const user = await prisma.user.findFirst({ where: { phone } })
    if (!user) {
        return res.status(404).send({ message: 'User not found' })
    }

    return res.status(200).send(user)
})

export default router
