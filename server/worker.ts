import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'

dotenv.config()

const prisma = new PrismaClient()

const worker = async () => {
    const links = await prisma.requests.findMany({ select: { url: true } })
    const urls: string[] = links.map((x) => x.url)
}

export default worker
