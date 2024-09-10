import express from 'express';
import {
  doGoogleAuth,
  getGoogleAuthUrl,
  resendVerificationEmail,
  verifyEmail,
} from '../controllers/authController';

const router = express.Router();

/**
 * @swagger
 * /auth/google-auth:
 *   post:
 *     summary: Google auth
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 description: Google auth code
 *               state:
 *                 type: string
 *                 description: Anti CSRF token
 *             example:
 *               code: "4/0AY0e-g4zQkZ6cLJzK1Kw4Z9sJ1BpY2r1JWl4XQGpQj8XJ2G7cDgU2bR7Q9I1X6n2Z0O9A"
 *     responses:
 *       200:
 *         description: Google auth
 */
router.post('/google-auth', doGoogleAuth);

/**
 * @swagger
 * /auth/get-google-auth-url:
 *   get:
 *     summary: Get Google auth URL
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Google auth URL
 */
router.get('/`get-google-auth-url`', getGoogleAuthUrl);

/**
 * @swagger
 * /auth/resend-email:
 *   post:
 *     summary: Resend verification email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Verification email
 *             example:
 *               code: "admin@ludan.online"
 *     responses:
 *       200:
 *         description: Resend verification email
 *
 */
router.post('/resend-email', resendVerificationEmail);

/**
 * @swagger
 * /auth/verify-email:
 *   post:
 *     summary: Verify email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: Verification token
 *             example:
 *               code: "4/0AY0e-g4zQkZ6cLJzK1Kw4Z9sJ1BpY2r1JWl4XQGpQj8XJ2G7cDgU2bR7Q9I1X6n2Z0O9A"
 *     responses:
 *       200:
 *         description: Verify email
 */
router.post('/verify-email', verifyEmail);

export default router;
