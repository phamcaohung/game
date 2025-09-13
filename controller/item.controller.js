import itemDAO from "../dao/item.dao.js"
import Item from "../model/item.model.js"


export default class itemController {
    static async createItem(req, res) {
        try {
            const { name, category } = req.body
            const data = new Item({
                name: name,
                category: category
            })
            await itemDAO.createItem(data)

            res.status(201).json({ message: "Item created successfully" })
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    static async getItems(req, res) {
        try {
            const items = await itemDAO.getItems()

            res.status(200).json(items)
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    
    static async deleteItem(req, res) {
        try {
            const id = req.params.id
            await itemDAO.deleteItem(id)

            res.status(200).json({ message: "Item deleted successfully" })
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    static async createItems(req, res) {
        try {
            const items = req.body

            await itemDAO.createItems(items)

            res.status(201).json({ message: "Items created successfully" })
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }
}