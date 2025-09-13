import express from 'express'
import usersController from '../controller/user.controller.js'
import { decodeToken } from '../middlewares/decodeToken.js'
import passport from 'passport'
import "../config/passport.js"


const router = express.Router()
const requireAuth = passport.authenticate("jwt", { session: false }, null)

router.route("/signup").post(usersController.createUser)

router.post("/signin", usersController.signin)

router.post("/logout", usersController.logout)

router.get("/profile", requireAuth, decodeToken, usersController.getProfileUser)

export default router

/**
* @swagger
*  /api/v1/users/signup:
*    post:
*      summary: Register a new user
*      tags:
*        - User
*      requestBody:
*        required: true
*        content:
*          application/json:
*            schema:
*              type: object
*              properties:
*                name:
*                  type: string
*                email:
*                  type: string
*                password:
*                  type: string
*              required: [name, email, password]
*      responses:
*        '201':
*          description: User created successfully
*/

/**
* @swagger
*  /api/v1/users/signin:
*    post:
*      summary: User login
*      tags:
*        - User
*      requestBody:
*        required: true
*        content:
*          application/json:
*            schema:
*              type: object
*              properties:
*                email:
*                  type: string
*                password:
*                  type: string
*              required: [email, password]
*      responses:
*        '200':
*          description: token, user (_id, name, email)
*        '401':
*          description: Invalid credentials
*/

/**
* @swagger
*  /api/v1/users/logout:
*    post:
*      summary: User logout
*      tags:
*        - User
*      responses:
*        '200':
*          description: Logout successful
*/

/**
* @swagger
*  /api/v1/users/profile/{id}:
*    get:
*      summary: Get user profile by ID
*      tags:
*        - User
*      security:
*        - bearerAuth: []
*      parameters:
*        - in: path
*          name: id
*          schema:
*            type: string
*          required: true
*          description: User ID
*      responses:
*        '200':
*          description: _id, name, email, score (_id, point, power)
*        '401':
*          description: Unauthorized
*/