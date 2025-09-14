import { ObjectId } from "mongodb"

let itemCollection

export default class itemDAO {
    static async injectDB(conn) {
        if (itemCollection)
            return
        try {
            itemCollection = await conn.db(process.env.DATABASE_NAME).collection("items")
        } catch (e) {
            console.error(`Unable to establish collection handles: ${e}`)
        }
    }

    static async createItem(item) {
        try {
            return await itemCollection.insertOne(item)
        } catch (e) {
            throw new Error("Error Creating Item: " + e)
        }
    }
    
    static async getItems() {
        try {
            return await itemCollection.find({}).toArray()
        } catch (e) {
            throw new Error("Error Getting Items: " + e)
        }
    }

    static async deleteItem(id) {
        try {
            return await itemCollection.deleteOne({ _id: new ObjectId(id) })
        } catch (e) {
            throw new Error("Error Deleting Item: " + e)
        }
    }

    static async createItems(items) {
        try {
            return await itemCollection.insertMany(items)
        } catch (e) {
            throw new Error("Error Creating Items: " + e)
        }
    }

    static async totalItems() {
        try {
            return await itemCollection.countDocuments()
        } catch (e) {
            throw new Error("Error Total Items: " + e)
        }
    }

    static async getRandomItem(skip, query) {
        try {
            return await itemCollection.find(query).skip(skip).limit(1).next()
        } catch (e) {
            throw new Error("Error Getting Random Item: " + e)
        }
    }

    static async totalItemsInCategory(query) {
        try {
            return await itemCollection.countDocuments(query)
        } catch (e) {
            throw new Error("Error Total Items In Category: " + e)
        }
    }
}
