
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
    
}