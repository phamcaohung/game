let tokenCollection

export default class tokenDAO {
    static async injectDB(conn) {
        if (tokenCollection)
            return
        try {
            tokenCollection = await conn.db(process.env.DATABASE_NAME).collection("token")
        } catch (e) {
            console.error(`Unable to establish collection handles: ${e}`)
        }
    }

    static async createToken(token) {
        try {
            const result = await tokenCollection.insertOne(token)
            return result
        } catch (e) {
            throw new Error("Error creating token: " + e);
        }
    }

    static async findByUser(id) {
        try {
            const result = await tokenCollection.findOne({ user: id })
            return result
        } catch (e) {
            throw new Error("Error getting User: " + e);
        }
    }

    static async deleteTokenByAccess(token) {
        try {
            const result = await tokenCollection.deleteOne({ token })
            return result
        } catch (e) {
            throw new Error("Error deleting token: " + e);
        }
    }
}