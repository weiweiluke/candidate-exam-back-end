// Desc: Dashboard routes
import express from 'express';
import { getStatistics, getUsers } from '../controllers/dashboardController';

const router = express.Router();

/**
 * @swagger
 * /dashboard/users:
 *   post:
 *     summary: Get all users
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: List of all users
 *       400:
 *         description: Error
 */

router.post('/users', getUsers);

/**
 * @swagger
 * /dashboard/statistics:
 *   post:
 *     summary: Get statistics
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Statistics
 *       400:
 *         description: Error
 */
router.post('/statistics', getStatistics);

export default router;
