// Desc: Dashboard routes
import express from 'express';
import { getStatistics, getUsers } from '../controllers/dashboardController';

const router = express.Router();

/**
 * @swagger
 * /dashboard/users:
 *   post:
 *     summary: Get registed user list
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: registed user list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  status:
 *                    type: integer
 *                    description: status of the request, 0 for success
 *                  data:
 *                    type: array
 *                    description: user list
 *                    items:
 *                      $ref: '#/components/schema/user'
 *                  message:
 *                    type: string
 *                    description: response message
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 0
 *                   description: status of the request, 0 for success
 *                 data:
 *                   type: object
 *                   description: statistics data
 *                   properties:
 *                     totalUsers:
 *                       type: integer
 *                       example: 100
 *                       description: total user count
 *                     activeSessionsToday:
 *                       type: integer
 *                       example: 10
 *                       description: active user count
 *                     avgActiveSessions:
 *                       type: number
 *                       example: 5.5
 *                       description: average active user count
 *                 message:
 *                   type: string
 *                   example: "success"
 *                   description: response message
 *       401:
 *         description: Unauthorized
 */
router.post('/statistics', getStatistics);

export default router;
