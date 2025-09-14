import { ObjectId } from "mongodb"

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

    static async setEquipment(equipment, userId) {
        try {
            return await equipmentCollection.replaceOne(
                { user: new ObjectId(userId) },
                equipment,
                { upsert: true }
            )
        } catch (e) {
            throw new Error("Error Set Equipment: " + e)
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
            const result = await equipmentCollection.aggregate([
                { $match: { user: new ObjectId(userId) } },
                ...lookupSlotItemOnly("head"),
                ...lookupSlotItemOnly("body"),
                ...lookupSlotItemOnly("leg"),
                ...lookupSlotItemOnly("jewelry"),
                ...lookupSlotItemOnly("weapon"),
                ...lookupSlotItemOnly("shield")
            ]).toArray()

            return result[0]
        } catch (e) {
            throw new Error("Error Get Equipment By User: " + e)
        }
    }
}

const lookupSlotItemOnly = (slot) => ([
    {
        $addFields: {
            [`${slot}ObjectId`]: { $toObjectId: `$${slot}` } 
        }
    },
    {
        $lookup: {
            from: "inventories",
            localField: `${slot}ObjectId`, 
            foreignField: "_id",
            as: "temp_inventory"
        }
    },
    {
        $unwind: {
            path: "$temp_inventory",
            preserveNullAndEmptyArrays: true
        }
    },
    {
        $addFields: {
            [slot]: {
                $cond: {
                    if: { $ifNull: ["$temp_inventory", false] },
                    then: "$temp_inventory.item",
                    else: null
                }
            }
        }
    },
    {
        $unset: ["temp_inventory", `${slot}ObjectId`]
    }
])

