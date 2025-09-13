import { ObjectId } from "mongodb"

let usersCollection

export default class usersDAO {
    static async injectDB(conn) {
        if (usersCollection)
            return
        try {
            usersCollection = await conn.db(process.env.DATABASE_NAME).collection("users")
        } catch (e) {
            console.error(`Unable to establish collection handles: ${e}`)
        }
    }

    static async createUser(data) {
        try {
            const result = await usersCollection.insertOne(data)
            return result
        } catch (e) {
            throw new Error("Error Creating User: " + e)
        }
    }

    static async signIn(email) {
        try {
            const result = await usersCollection.findOne({ email: email })
            return result
        } catch (e) {
            throw new Error("Error signIn user: " + e)
        }
    }

    static async getUserById(id) {
        try {
            return await usersCollection.findOne({ _id: new ObjectId(id) })
        } catch (e) {
            throw new Error("Error Getting User By Id: " + e)
        }
        
    }

    static async findByEmail(email) {
        try {
            return await usersCollection.findOne({ email: email })
        } catch (e) {
            throw new Error("Error Getting User By Email: " + e)
        }
    }

    static async addInventoryToUser(userId, inventoryId) {
        try {
            return await usersCollection.findOneAndUpdate(
                { _id: new ObjectId(userId) },
                { $addToSet: { inventories: inventoryId } }
            )
        } catch (e) {
            throw new Error("Error Add Inventory To User: " + e)
        }
    }

}