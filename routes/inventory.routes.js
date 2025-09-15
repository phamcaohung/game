import express from 'express'
import passport from 'passport'
import { decodeToken } from '../middlewares/decodeToken.js'
import inventoryController from '../controller/inventory.controller.js'



const router = express.Router()
const requireAuth = passport.authenticate("jwt", { session: false }, null)
router.use(requireAuth, decodeToken)

router.post("/victory", inventoryController.createRandomItem)

router.get("/", inventoryController.getInventories)

router.get("/gem", inventoryController.getInventoriesGem)

router.get("/not-gem", inventoryController.getInventoriesNotGem)

router.post("/:id/mosaic", inventoryController.mosaicGem)

router.post("/:id/dismantle", inventoryController.dismantleEquip)

export default router
