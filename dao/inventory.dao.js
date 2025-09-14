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

    static async findInventoryById(id) {
        try {
            return await inventoryCollection.findOne({ _id: new ObjectId(id) })
        } catch (e) {
            throw new Error("Error Getting Inventory: " + e)
        }
    }

    static async mosaicGemToInventory(id, value) {
        try {
            return await inventoryCollection.findOneAndUpdate(
                { _id: new ObjectId(id) },
                { 
                    $inc: { 
                        atk: value,
                        def: value,
                        hp: value
                    } 
                },
                { returnDocument: 'after' }
            )
        } catch (e) {
            throw new Error("Error Mosaic Gem To Inventory: " + e)
        }
    }

    static async deleteGemAfterMosaic(id) {
        try {
            return await inventoryCollection.deleteOne({ _id: new ObjectId(id) })
        } catch (e) {
            throw new Error("Error Delete Gem After Mosaic: " + e)
        }
    }

    static async getGemByUser(userId) {
        try {
            return await inventoryCollection.find({
                user: new ObjectId(userId),
                "item.category": "Gem" 
            }).toArray()
        } catch (e) {
            throw new Error("Error Get Gem By User: " + e)
        }
    }

    static async getNotGemByUser(userId) {
        try {
            return await inventoryCollection.find({ 
                user: new ObjectId(userId) ,
                "item.category": { $ne: "Gem" } 
            }).toArray()
        } catch (e) {
            throw new Error("Error Get Gem By User: " + e)
        }
    }
}