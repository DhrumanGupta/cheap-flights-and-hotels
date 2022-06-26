import { Router, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import authenticateUser from '../middleware/authenticateUser'
import { sendMessage } from '../services/twilio'
import {
    parseURLs,
    getLowestPriceForFlight,
    getLowestPriceForHotel,
} from '../scrape'

const prisma = new PrismaClient()
const router = Router()

const supportedUrl = (obj: URL): boolean => {
    const supported = [
        'https://www.makemytrip.com/hotels/hotel-listing',
        'https://www.makemytrip.com/flight/search',
    ]

    let built = `${obj.origin}${obj.pathname}`

    if (built.endsWith('/')) {
        built = built.slice(0, -1)
    }

    console.log(built)

    return supported.includes(built)
}

router.post('/add', authenticateUser, async (req: Request, res: Response) => {
    const url: string = req.body?.url.split('#')[0]
    const target: number = req.body?.target

    if (!url || !target) {
        return res.status(400).send({ message: 'No URL provided' })
    }

    let obj: URL
    try {
        obj = new URL(url)
    } catch {
        return res.status(400).send({ message: 'URL not supported' })
    }

    if (!supportedUrl(obj)) {
        return res.status(400).send({ message: 'URL not supported' })
    }

    const user = await prisma.user.findFirst({
        // @ts-ignore
        where: { phone: req.phone },
    })

    const existing = await prisma.request.findFirst({
        where: {
            url: url,
            userId: user?.id || '',
        },
    })

    if (existing) {
        return res.status(400).send({ message: 'URL already exists' })
    }

    const request = await prisma.request.create({
        data: {
            url,
            userId: user?.id || '',
            target,
        },
    })

    // @ts-ignore
    sendMessage(
        user?.phone,
        `New request added. If the price goes below ${
            target || '-'
        }, you will be notified.`
    )

    res.status(200).send(request)
})

router.post('/', async (req: Request, res: Response) => {
    const url = req.body?.url
    if (!url) {
        return res.status(400).send({ message: 'No URL provided' })
    }

    let split = parseURLs([url])

    if (split.flights.length + split.hotels.length === 0) {
        return res.status(400).send({ message: 'Invalid URL provided' })
    }

    const isFlight = split.flights.length > 0

    const val = isFlight
        ? await getLowestPriceForFlight(split.flights[0])
        : await getLowestPriceForHotel(split.hotels[0])

    return res.status(200).send({ price: val })
})

router.get('/', authenticateUser, async (req: Request, res: Response) => {
    const user = await prisma.user.findFirst({
        // @ts-ignore
        where: { phone: req.phone },
        select: {
            requests: {
                select: { url: true, id: true, target: true },
            },
        },
    })

    res.status(200).send(user?.requests || [])
})

router.get('/:id', authenticateUser, async (req: Request, res: Response) => {
    const id = req.params.id

    const user = await prisma.user.findFirst({
        // @ts-ignore
        where: { phone: req.phone },
        select: {
            id: true,
        },
    })

    const request = await prisma.request.findFirst({
        // @ts-ignore
        where: { id, userId: user.id },
        select: {
            url: true,
            id: true,
            target: true,
        },
    })

    if (!request) {
        return res.status(400).send({ message: 'Request not found' })
    }
    res.status(200).send(request)
})

router.delete('/:id', authenticateUser, async (req: Request, res: Response) => {
    const id = req.params.id

    const user = await prisma.user.findFirst({
        // @ts-ignore
        where: { phone: req.phone },
        select: {
            id: true,
        },
    })

    const requestId = (
        await prisma.request.findFirst({
            // @ts-ignore
            where: { id },
            select: {
                userId: true,
            },
        })
    )?.userId

    if (!requestId || requestId !== user?.id) {
        return res.status(400).send({ message: 'Request not found' })
    }

    await prisma.request.delete({
        // @ts-ignore
        where: { id },
    })

    res.status(200).send({ msg: 'ok' })
})

export default router
