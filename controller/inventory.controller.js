import itemsDAO from "../dao/item.dao.js"
import usersDAO from "../dao/user.dao.js"
import Inventory from "../model/inventory.model.js"
import inventoryDAO from "../dao/inventory.dao.js"
import { getRandomNumber } from "../config/random.js"
import scoreDAO from "../dao/score.dao.js"
import { ObjectId } from "mongodb"


export default class inventoryController {
    static async createRandomItem(req, res) {
        try {
            const userId = req.userId
            console.log("userId: ", userId);
            
            const { master } = req.query

            const drop = Math.floor(Math.random() * 5) + 1
            const totalItems = await itemsDAO.totalItems()

            const newInventories = []

            for (let i = 0; i < drop; i++) {
                const randomIndex = Math.floor(Math.random() * totalItems)
                const randomItem = await itemsDAO.getRandomItem(randomIndex)

                if (!randomItem) {
                    return res.status(500).json({ error: "Failed To Get Random Item" });
                }

                const inventory = new Inventory({
                    item: randomItem,
                    user: new ObjectId(userId),
                    atk: getRandomNumber(-666, (666 + parseInt(master) * 20)),
                    def: getRandomNumber(-666, (666 + parseInt(master) * 20)),
                    hp: getRandomNumber(-666, (666 + parseInt(master) * 20)),
                    lucky: getRandomNumber(-2, 2)
                })

                console.log("Inventory: ", inventory);

                const inventoryId = await inventoryDAO.createInventory(inventory)
                console.log("InventoryId: ", inventoryId);
                
                await usersDAO.addInventoryToUser(userId, inventoryId)

                newInventories.push(inventory)
            }

            await scoreDAO.updateScoreAfterVictory(userId)

            res.status(200).json(newInventories)
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }
}