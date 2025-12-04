const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a new hike
exports.createHike = async (req, res) => {
    try {
        const { title, description } = req.body;
        const userId = req.userId; // Assuming auth middleware adds user to req

        const hike = await prisma.hike.create({
            data: {
                title,
                description,
                userId
            }
        });

        res.status(201).json(hike);
    } catch (error) {
        console.error('Error creating hike:', error);
        res.status(500).json({ error: 'Failed to create hike' });
    }
};

// Get all hikes for the logged-in user
exports.getHikes = async (req, res) => {
    try {
        const userId = req.userId;
        const hikes = await prisma.hike.findMany({
            where: { userId },
            orderBy: { updatedAt: 'desc' },
            include: {
                _count: {
                    select: { routes: true }
                }
            }
        });
        res.json(hikes);
    } catch (error) {
        console.error('Error fetching hikes:', error);
        res.status(500).json({ error: 'Failed to fetch hikes' });
    }
};

// Get a single hike with its routes
exports.getHike = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const hike = await prisma.hike.findFirst({
            where: {
                id: parseInt(id),
                userId
            },
            include: {
                routes: {
                    orderBy: { order: 'asc' }
                }
            }
        });

        if (!hike) {
            return res.status(404).json({ error: 'Hike not found' });
        }

        // Parse route data JSON strings back to objects
        const hikeWithParsedRoutes = {
            ...hike,
            routes: hike.routes.map(route => ({
                ...route,
                data: JSON.parse(route.data)
            }))
        };

        res.json(hikeWithParsedRoutes);
    } catch (error) {
        console.error('Error fetching hike:', error);
        res.status(500).json({ error: 'Failed to fetch hike' });
    }
};

// Update a hike
exports.updateHike = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;
        const userId = req.userId;

        const hike = await prisma.hike.findFirst({
            where: { id: parseInt(id), userId }
        });

        if (!hike) {
            return res.status(404).json({ error: 'Hike not found' });
        }

        const updatedHike = await prisma.hike.update({
            where: { id: parseInt(id) },
            data: { title, description }
        });

        res.json(updatedHike);
    } catch (error) {
        console.error('Error updating hike:', error);
        res.status(500).json({ error: 'Failed to update hike' });
    }
};

// Delete a hike
exports.deleteHike = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const hike = await prisma.hike.findFirst({
            where: { id: parseInt(id), userId }
        });

        if (!hike) {
            return res.status(404).json({ error: 'Hike not found' });
        }

        await prisma.hike.delete({
            where: { id: parseInt(id) }
        });

        res.json({ message: 'Hike deleted successfully' });
    } catch (error) {
        console.error('Error deleting hike:', error);
        res.status(500).json({ error: 'Failed to delete hike' });
    }
};

// Add a route to a hike
exports.addRouteToHike = async (req, res) => {
    try {
        const { id } = req.params; // hikeId
        const { name, type, order, data } = req.body;
        const userId = req.userId;

        const hike = await prisma.hike.findFirst({
            where: { id: parseInt(id), userId }
        });

        if (!hike) {
            return res.status(404).json({ error: 'Hike not found' });
        }

        const route = await prisma.route.create({
            data: {
                name,
                type,
                order,
                data: JSON.stringify(data), // Store as JSON string
                hikeId: parseInt(id)
            }
        });

        res.status(201).json({
            ...route,
            data: JSON.parse(route.data)
        });
    } catch (error) {
        console.error('Error adding route:', error);
        res.status(500).json({ error: 'Failed to add route' });
    }
};

// Update a route
exports.updateRoute = async (req, res) => {
    try {
        const { hikeId, routeId } = req.params;
        const { name, type, order, data } = req.body;
        const userId = req.userId;

        // Verify ownership via hike
        const hike = await prisma.hike.findFirst({
            where: { id: parseInt(hikeId), userId }
        });

        if (!hike) {
            return res.status(404).json({ error: 'Hike not found' });
        }

        const route = await prisma.route.update({
            where: { id: parseInt(routeId) },
            data: {
                name,
                type,
                order,
                data: JSON.stringify(data)
            }
        });

        res.json({
            ...route,
            data: JSON.parse(route.data)
        });
    } catch (error) {
        console.error('Error updating route:', error);
        res.status(500).json({ error: 'Failed to update route' });
    }
};

// Delete a route
exports.deleteRoute = async (req, res) => {
    try {
        const { hikeId, routeId } = req.params;
        const userId = req.userId;

        // Verify ownership via hike
        const hike = await prisma.hike.findFirst({
            where: { id: parseInt(hikeId), userId }
        });

        if (!hike) {
            return res.status(404).json({ error: 'Hike not found' });
        }

        await prisma.route.delete({
            where: { id: parseInt(routeId) }
        });

        res.json({ message: 'Route deleted successfully' });
    } catch (error) {
        console.error('Error deleting route:', error);
        res.status(500).json({ error: 'Failed to delete route' });
    }
};
