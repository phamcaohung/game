import express from 'express'
import passport from 'passport'
import { decodeToken } from '../middlewares/decodeToken.js'
import inventoryController from '../controller/inventory.controller.js'



const router = express.Router()
const requireAuth = passport.authenticate("jwt", { session: false }, null)
router.use(requireAuth, decodeToken)

router.post("/victory", inventoryController.createRandomItem)

router.get("/", inventoryController.getInventories)


export default router
