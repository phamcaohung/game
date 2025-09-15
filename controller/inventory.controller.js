import itemsDAO from "../dao/item.dao.js"
import usersDAO from "../dao/user.dao.js"
import Inventory from "../model/inventory.model.js"
import inventoryDAO from "../dao/inventory.dao.js"
import { addLevelInfo, getRandomItemByCategory, getRandomNumber, randomGem, randomNumberAdd } from "../config/random.js"
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

                const inventory = randomItem.category === 'Gem' ? new Inventory({
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

            const data = inventories.map((item) => ({
                ...item,
                levelType: item.item.category === "Gem" ? addLevelInfo(item.item.name)[0] : null,
                levelColor: item.item.category === "Gem" ? addLevelInfo(item.item.name)[1] : null
            }))

            res.status(200).json(data)
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    static async mosaicGem(req, res) {
        try {
            const id = req.params.id
            const gemId = req.body.gemId

            const gem = await inventoryDAO.findInventoryById(gemId)
            if (!gem)
                return res.status(404).json({ message: "Gem Not Found" })

            const value = randomNumberAdd(gem.item.name)

            const data = await inventoryDAO.mosaicGemToInventory(id, value)
            if (data)
                await inventoryDAO.deleteGemAfterMosaic(gemId)

            res.status(200).json(data)
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    static async getInventoriesGem(req, res) {
        try {
            const userId = req.userId

            const inventories = await inventoryDAO.getGemByUser(userId)

            res.status(200).json(inventories)
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    static async getInventoriesNotGem(req, res) {
        try {
            const userId = req.userId

            const inventories = await inventoryDAO.getNotGemByUser(userId)

            res.status(200).json(inventories)
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    static async dismantleEquip(req, res) {
        try {
            const userId = req.userId
            const id = req.params.id

            await inventoryDAO.deleteGemAfterMosaic(id)

            const drop = Math.floor(Math.random() * 3) + 1

            const newInventories = []

            for (let i = 0; i < drop; i++) {
                const gem = randomGem()
                console.log("type: ", gem);
                
                const query = { name: { $regex: `^${gem}` } }

                const totalInCategory = await itemsDAO.totalItemsInCategory(query)
                const randomIndex = Math.floor(Math.random() * totalInCategory)

                const randomItem = await itemsDAO.getRandomItem(randomIndex, query)

                if (!randomItem) {
                    return res.status(500).json({ error: "Failed To Get Random Item" });
                }

                const inventory = new Inventory({
                    item: randomItem,
                    user: new ObjectId(userId),
                    lucky: getRandomNumber(-2, 2)
                })
                console.log("inventory: ", inventory);
                
                const inventoryId = await inventoryDAO.createInventory(inventory)

                await usersDAO.addInventoryToUser(userId, inventoryId)

                newInventories.push(inventory)
            }

            res.status(200).json(newInventories)
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }
}