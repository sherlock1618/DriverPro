const express = require("express");
const profileRouter = express.Router();
const { authenticateToken } = require("../service/auth");
const {
    HTTPGetProfile,
    HTTPCreateProfile,
    HTTPRemoveProfile,
    HTTPUpdateAccount,
    HTTPLogin,
    HTTPLogout
} = require("./profile.controller");

/**
 * @swagger
 * /profile/{id}:
 *   get:
 *     summary: Retrieve a user profile by ID
 *     tags: [Profile]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numeric ID of the user profile to retrieve
 *     responses:
 *       200:
 *         description: The user profile data
 *       404:
 *         description: Profile not found
 *       401:
 *         description: Unauthorized access
 */
profileRouter.get("/profile/:id", authenticateToken, HTTPGetProfile);

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user profile
 *     tags: [Profile]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *             required:
 *               - phone
 *               - password
 *     responses:
 *       201:
 *         description: Profile created successfully
 *       400:
 *         description: Invalid input data
 */
profileRouter.post("/register", HTTPCreateProfile);

/**
 * @swagger
 * /delete-account/{id}:
 *   delete:
 *     summary: Delete a user profile by ID
 *     tags: [Profile]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numeric ID of the user profile to delete
 *     responses:
 *       200:
 *         description: Profile deleted successfully
 *       404:
 *         description: Profile not found
 *       401:
 *         description: Unauthorized access
 */
profileRouter.delete("/delete-account/:id", authenticateToken, HTTPRemoveProfile);

/**
 * @swagger
 * /update-account:
 *   put:
 *     summary: Update profile details (except role).
 *     tags: 
 *       - Profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: The unique identifier for the profile.
 *               phone:
 *                 type: string
 *                 description: The user's phone number.
 *               password:
 *                 type: string
 *                 description: The user's password.
 *     responses:
 *       200:
 *         description: Profile successfully updated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: Profile ID.
 *                 phone:
 *                   type: string
 *                   description: Updated phone number.
 *       400:
 *         description: Bad request or attempt to update role field.
 *       404:
 *         description: Profile not found.
 */
profileRouter.put("/update-account", authenticateToken, HTTPUpdateAccount);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Authentication failed
 */
profileRouter.post("/login", HTTPLogin);

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Log out a user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User logged out successfully
 *       401:
 *         description: Unauthorized access
 */
profileRouter.post("/logout/:id", authenticateToken, HTTPLogout);

module.exports = profileRouter;
