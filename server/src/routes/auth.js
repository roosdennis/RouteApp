const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: { username },
        });

        if (!user) {
            return res.status(404).send({ message: 'User Not found.' });
        }

        const passwordIsValid = await bcrypt.compare(password, user.password);

        if (!passwordIsValid) {
            return res.status(401).send({ accessToken: null, message: 'Invalid Password!' });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: 86400, // 24 hours
        });

        res.status(200).send({
            id: user.id,
            username: user.username,
            role: user.role,
            accessToken: token,
        });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

module.exports = router;
