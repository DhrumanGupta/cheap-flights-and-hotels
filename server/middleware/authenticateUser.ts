import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const jwtAuthToken = process.env.JWT_AUTH_TOKEN || ''

const authenticateUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const accessToken = req.cookies?.accessToken

    if (!accessToken) {
        return res.status(403).send({ message: 'User not authenticated' })
    }

    // @ts-ignore
    jwt.verify(accessToken, jwtAuthToken, (err, phone) => {
        if (phone) {
            // @ts-ignore
            req.phone = phone
            next()
            return
        }

        if (err.message === 'TokenExpiredError') {
            res.status(403).send({ message: 'Token Expired' })
            return
        }

        console.error(err)
        res.status(403).send({ error: err, message: 'User not authenticated' })
    })
}

export default authenticateUser
