
let equipmentCollection

export default class equipmentDAO {
    static async injectDB(conn) {
        if (equipmentCollection)
            return
        try {
            equipmentCollection = await conn.db(process.env.DATABASE_NAME).collection("equipments")
        } catch (e) {
            console.error(`Unable to establish collection handles: ${e}`)
        }
    }

    static async createEquipment(equipment) {
        try {
            const result = await equipmentCollection.insertOne(equipment)
            return result.insertedId
        } catch (e) {
            throw new Error("Error Add Equipment To User: " + e)
        }
    }

    static async getEquipmentById(id) {
        try {
            const equipment = await equipmentCollection.findOne({ _id: id })
            return equipment
        } catch (e) {
            throw new Error("Error Get Equipment By Id: " + e)
        }
    }

    static async getEquipmentByUser(userId) {
        try {
            return await equipmentCollection.find({ user: userId }).toArray()
        } catch (e) {
            throw new Error("Error Get Equipment By User: " + e)
        }
    }

}
