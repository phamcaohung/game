import express from 'express'
import itemController from '../controller/item.controller.js'

const router = express.Router()

router.get("/", itemController.getItems)

router.post("/", itemController.createItem)

router.post("/creates", itemController.createItems)

router.delete("/:id", itemController.deleteItem)

export default router

