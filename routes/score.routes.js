import express from 'express'
import passport from 'passport'
import { decodeToken } from '../middlewares/decodeToken.js'
import scoreController from '../controller/score.controller.js'


const router = express.Router()
const requireAuth = passport.authenticate("jwt", { session: false }, null)
router.use(requireAuth, decodeToken)

router.get("/rank", scoreController.getRank)

router.get("/:id", scoreController.getScore)

router.put("/:id", scoreController.updateScore)

export default router

/**
* @swagger
*  /api/v1/scores/{id}:
*    get:
*      summary: Get score by ID
*      tags:
*        - Score
*      security:
*        - bearerAuth: []
*      parameters:
*        - in: path
*          name: id
*          schema:
*            type: string
*          required: true
*          description: Score ID
*      responses:
*        '200':
*          description: _id, point, power, user (_id, name)
*/

/**
* @swagger
*  /api/v1/scores/{id}:
*    put:
*      summary: Update score by ID
*      tags:
*        - Score
*      security:
*        - bearerAuth: []
*      parameters:
*        - in: path
*          name: id
*          schema:
*            type: string
*          required: true
*          description: Score ID
*      requestBody:
*        required: true
*        content:
*          application/json:
*            schema:
*              type: object
*              properties:
*                point:
*                  type: integer
*                power:
*                  type: integer
*              required: [point, power]
*      responses:
*        '200':
*          description: _id, point, power, user (_id, name)
*/

/**
* @swagger
*  /api/v1/scores/rank:
*    get:
*      summary: Get top scores
*      tags:
*        - Score
*      security:
*        - bearerAuth: []
*      parameters:
*        - in: query
*          name: limit
*          schema:
*            type: integer
*          required: false
*          description: Number of top scores to retrieve
*      responses:
*        '200':
*          description: Array[_id, point, power, user (_id, name)].sort by point desc
*/
