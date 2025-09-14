import { ObjectId } from "mongodb"

let inventoryCollection

export default class inventoryDAO {
    static async injectDB(conn) {
        if (inventoryCollection)
            return
        try {
            inventoryCollection = await conn.db(process.env.DATABASE_NAME).collection("inventories")
        } catch (e) {
            console.error(`Unable to establish collection handles: ${e}`)
        }
    }

    static async createInventory(inventory) {
        try {
            const result = await inventoryCollection.insertOne(inventory)
            return result.insertedId
        } catch (e) {
            throw new Error("Error Creating Inventory: " + e)
        }
    }

    static async getInventoriesByUser(userId) {
        try {
            return await inventoryCollection.find({ user: new ObjectId(userId) }).toArray()
        } catch (e) {
            throw new Error("Error Getting Inventories: " + e)
        }
    }
    
}