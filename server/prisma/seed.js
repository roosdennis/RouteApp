const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
require('dotenv').config();

console.log('DATABASE_URL:', process.env.DATABASE_URL);

const prisma = new PrismaClient();

async function main() {
    const passwordDennis = await bcrypt.hash('dennis', 10);
    const passwordAdmin = await bcrypt.hash('admin', 10);

    const dennis = await prisma.user.upsert({
        where: { username: 'dennis' },
        update: {},
        create: {
            username: 'dennis',
            password: passwordDennis,
            role: 'user',
        },
    });

    const admin = await prisma.user.upsert({
        where: { username: 'admin' },
        update: {},
        create: {
            username: 'admin',
            password: passwordAdmin,
            role: 'admin',
        },
    });

    console.log({ dennis, admin });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
