import express from 'express'
import passport from 'passport'
import { decodeToken } from '../middlewares/decodeToken.js'
import equipmentController from '../controller/equipment.controller.js'



const router = express.Router()
const requireAuth = passport.authenticate("jwt", { session: false }, null)
router.use(requireAuth, decodeToken)

router.post("/", equipmentController.equipItem)

router.get("/", equipmentController.getEquipment)


export default router
