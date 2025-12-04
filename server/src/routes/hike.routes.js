const express = require('express');
const router = express.Router();
const hikeController = require('../controllers/hike.controller');
const { verifyToken } = require('../middleware/auth'); // Assuming you have an auth middleware

// Apply auth middleware to all hike routes
router.use(verifyToken);

router.post('/', hikeController.createHike);
router.get('/', hikeController.getHikes);
router.get('/:id', hikeController.getHike);
router.put('/:id', hikeController.updateHike);
router.delete('/:id', hikeController.deleteHike);

router.post('/:id/routes', hikeController.addRouteToHike);
router.put('/:hikeId/routes/:routeId', hikeController.updateRoute);
router.delete('/:hikeId/routes/:routeId', hikeController.deleteRoute);

module.exports = router;
