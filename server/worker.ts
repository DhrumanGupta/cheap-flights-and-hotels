import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'
import { getLowestPricesForMultipleFlights } from './scrape'

dotenv.config()

const prisma = new PrismaClient()

const worker = async () => {
    const data = await prisma.requests.findMany({
        select: { ccde: true, itinerary: true },
    })

    const res = await getLowestPricesForMultipleFlights(data)
    console.log(data)
    console.log(res)
}

export default worker
