import { Router, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import authenticateUser from '../middleware/authenticateUser'

const prisma = new PrismaClient()
const router = Router()

router.post('/add', authenticateUser, async (req: Request, res: Response) => {
    const url: string = req.body?.url
    if (!url) {
        res.status(400).send({ message: 'Invalid parameters provided' })
        return
    }

    const user = await prisma.user.findFirst({
        // @ts-ignore
        where: { phone: req.phone },
        select: { id: true },
    })

    const request = await prisma.request.create({
        data: {
            url,
            userId: user?.id || '',
        },
    })

    res.status(200).send(request)
})

export default router
