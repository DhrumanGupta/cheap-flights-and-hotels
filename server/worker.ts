import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'
import { getLowestPricesForMultipleFlights } from './scrape'

dotenv.config()

const prisma = new PrismaClient()

const worker = async () => {
    const data = await prisma.request.findMany({
        select: { url: true },
    })

    const urls = data.map((x) => x.url)

    // const res = await getLowestPricesForMultipleFlights(data)
    // console.log(data)
    // console.log(res)
}

export default worker
