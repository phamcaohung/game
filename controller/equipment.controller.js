import equipmentDAO from "../dao/equipment.dao.js"
import usersDAO from "../dao/user.dao.js"
import Equipment from "../model/equipment.model.js"


export default class equipmentController {
    static async equipItem(req, res) {
        try {
            const userId = req.userId
            const { head, body, legs, jewelry, weapon, shield } = req.body
            const equipment =  new Equipment({
                head, body, legs, jewelry, weapon, shield, user: userId
            })
            console.log("Equipment: ", equipment);
            
            const equipmentId = await equipmentDAO.createEquipment(equipment)

            await usersDAO.addEquipmentToUser(userId, equipmentId)

            const data = await equipmentDAO.getEquipmentById(equipmentId)
            console.log("data: ", data);

            res.status(200).json(data)
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    static async getEquipment(req, res) {
        try {
            const userId = req.userId

            const equipment = await equipmentDAO.getEquipmentByUser(userId)
            console.log("equipment: ", equipment);
            
            res.status(200).json(equipment)
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }
}