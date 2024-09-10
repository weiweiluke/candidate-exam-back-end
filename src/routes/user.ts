import express from 'express';
import {
  signUpUser,
  signInUser,
  logoutUser,
  modifyProfile,
  modifyPassword,
} from '../controllers/userController';

const router = express.Router();

/**
 * @swagger
 * /users/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *                email: luke.macer@gmail.com
 *                password: 123!@#qweQWE
 *     responses:
 *       200:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  success:
 *                    type: string
 *                    description: status of the request
 *                  data:
 *                    type: object
 *                    description: data returned
 *                  message:
 *                    type: string
 *                    description: response message
 *       400:
 *         description: Invalid request body
 */
router.post('/signup', signUpUser);

/**
 * @swagger
 * /users/signin:
 *   post:
 *     summary: User login
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  success:
 *                    type: string
 *                    description: status of the request
 *                  data:
 *                    type: object
 *                    description: data returned
 *                  message:
 *                    type: string
 *                    description: response message
 *       400:
 *         description: Invalid request body
 */

router.post('/signin', signInUser);

/**
 * @swagger
 * /users/logout:
 *   get:
 *     summary: User logout
 *     tags: [User]
 *     responses:
 *       200:
 *         description: User logged out successfully
 *       400:
 *         description: User not logged in
 */
router.get('/logout', logoutUser);

/**
 * @swagger
 * /users/update-profile:
 *   put:
 *     summary: Update user profile
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *             example:
 *               firstName: John
 *               lastName: Doe
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  success:
 *                    type: string
 *                    description: status of the request
 *                  data:
 *                    type: object
 *                    description: data returned
 *                  message:
 *                    type: string
 *                    description: response message
 *       400:
 *         description: Invalid request body
 */
router.put('/modify-profile', modifyProfile);

/**
 * @swagger
 * /users/update-password:
 *   put:
 *     summary: Update user password
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *             example:
 *               oldPassword: 123!@#qweQWE
 *               newPassword: 123!@#qweQWE
 *     responses:
 *       200:
 *         description: User password updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  success:
 *                    type: string
 *                    description: status of the request
 *                  data:
 *                    type: object
 *                    description: data returned
 *                  message:
 *                    type: string
 *                    description: response message
 *       400:
 *         description: Invalid request body
 */
router.put('/modify-password', modifyPassword);

export default router;
