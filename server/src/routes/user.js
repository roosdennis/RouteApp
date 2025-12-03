const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { verifyToken, isAdmin } = require('../middleware/auth');

const prisma = new PrismaClient();

// Get all users (Protected)
router.get('/', [verifyToken], async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                role: true,
            },
        });
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// Delete user (Admin only)
router.delete('/:id', [verifyToken, isAdmin], async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        await prisma.user.delete({
            where: { id: id },
        });
        res.status(200).send({ message: 'User was deleted successfully!' });
    } catch (error) {
        res.status(500).send({ message: 'Could not delete user ' + id });
    }
});

module.exports = router;
