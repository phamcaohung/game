import itemsDAO from "../dao/item.dao.js"
import usersDAO from "../dao/user.dao.js"
import Inventory from "../model/inventory.model.js"
import inventoryDAO from "../dao/inventory.dao.js"
import { getRandomItemByCategory, getRandomNumber } from "../config/random.js"
import scoreDAO from "../dao/score.dao.js"
import { ObjectId } from "mongodb"


export default class inventoryController {
    static async createRandomItem(req, res) {
        try {
            const userId = req.userId

            const { master } = req.query

            const drop = Math.floor(Math.random() * 5) + 1

            const newInventories = []

            for (let i = 0; i < drop; i++) {
                const { category, type } = getRandomItemByCategory()

                let query = {};
                if (category === 'Gem' && type) {
                    query = { name: { $regex: `^${type}` } }
                } else {
                    query = { category }
                }

                console.log("category: ", category);
                console.log("type: ", type);

                const totalInCategory = await itemsDAO.totalItemsInCategory(query)
                const randomIndex = Math.floor(Math.random() * totalInCategory)

                const randomItem = await itemsDAO.getRandomItem(randomIndex, query)

                if (!randomItem) {
                    return res.status(500).json({ error: "Failed To Get Random Item" });
                }

                const inventory = randomItem.category == 'gem' ? new Inventory({
                    item: randomItem,
                    user: new ObjectId(userId),
                    lucky: getRandomNumber(-2, 2)
                }) : new Inventory({
                    item: randomItem,
                    user: new ObjectId(userId),
                    atk: getRandomNumber(-666, (666 + parseInt(master) * 20)),
                    def: getRandomNumber(-666, (666 + parseInt(master) * 20)),
                    hp: getRandomNumber(-666, (666 + parseInt(master) * 20)),
                    lucky: getRandomNumber(-2, 2)
                })

                const inventoryId = await inventoryDAO.createInventory(inventory)

                await usersDAO.addInventoryToUser(userId, inventoryId)

                newInventories.push(inventory)
            }

            await scoreDAO.updateScoreAfterVictory(userId)

            res.status(200).json(newInventories)
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    static async getInventories(req, res) {
        try {
            const userId = req.userId
            const inventories = await inventoryDAO.getInventoriesByUser(userId)

            res.status(200).json(inventories)
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }
}