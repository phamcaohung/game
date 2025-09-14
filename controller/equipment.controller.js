import e from "express"
import equipmentDAO from "../dao/equipment.dao.js"
import usersDAO from "../dao/user.dao.js"
import Equipment from "../model/equipment.model.js"
import { ObjectId } from "mongodb"


export default class equipmentController {
    static async equipItem(req, res) {
        try {
            const userId = req.userId
            const { head, body, leg, jewelry, weapon, shield } = req.body
            const equipment = new Equipment({
                head, body, leg, jewelry, weapon, shield, user: new ObjectId(userId)
            })

            const result = await equipmentDAO.setEquipment(equipment, userId)

            if (result.upsertedId) {
                await usersDAO.addEquipmentToUser(userId, result.upsertedId)
            } 
            const data = await equipmentDAO.getEquipmentByUser(userId)

            res.status(200).json(data)
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    static async getEquipment(req, res) {
        try {
            const userId = req.userId

            const equipment = await equipmentDAO.getEquipmentByUser(userId)

            res.status(200).json(equipment)
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }
}