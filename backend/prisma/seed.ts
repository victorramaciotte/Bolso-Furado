import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const defaultCategories = [
        'Alimentação',
        'Transporte',
        'Moradia',
        'Saúde',
        'Educação',
        'Lazer',
        'Vestuário'
    ]

    function normalizeCategoryName(name: string) {
        return name
            .trim()
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
        }

    

    for (const name of defaultCategories) {
        const normalizedName = normalizeCategoryName(name)
        const exists = await prisma.category.findFirst({
        where: {
            normalizedName,
            userId: null
        }
        })

        if (!exists) {
        await prisma.category.create({
            data: {
            name,
            normalizedName,
            userId: null
            }
        })
        }
    }
    }

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())