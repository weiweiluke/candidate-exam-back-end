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
 *     summary: This interface handles login or registration validation by using the code obtained from Google’s OAuth2 authentication.
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
 *               state: "some-random-string-in-session"
 *     responses:
 *       200:
 *         $ref: '#/components/responses/SuccessResponse'
 */
router.post('/google-auth', doGoogleAuth);

/**
 * @swagger
 * /auth/get-google-auth-url:
 *   get:
 *     summary: This interface is used to obtain the authorization URL for Google OAuth2.
 *     tags: [Auth]
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: integer
 *                 message: string
 *                 data:
 *                   url: string
 *                   description: Google Authorized Link
 *               example:
 *                 status: 0
 *                 message: "Success"
 *                 data:
 *                   url: "https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email&response_type=code&client_id=1234567890-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fgoogle-auth"
 *
 */
router.get('/get-google-auth-url', getGoogleAuthUrl);

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
 *                 example: admin@ludan.online
 *                 description: Verification email
 *     responses:
 *       200:
 *         $ref: '#/components/responses/SuccessResponse'
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
 *         $ref: '#/components/responses/SuccessResponse'
 */
router.post('/verify-email', verifyEmail);

export default router;
