import { ObjectId } from "mongodb"


let scoreCollection

export default class scoreDAO {
    static async injectDB(conn) {
        if (scoreCollection)
            return
        try {
            scoreCollection = await conn.db(process.env.DATABASE_NAME).collection("scores")
        } catch (e) {
            console.error(`Unable to establish collection handles: ${e}`)
        }
    }

    static async createScore(data) {
        try {
            const result = await scoreCollection.insertOne(data)
            return result.insertedId
        } catch (e) {
            throw new Error("Error creating score: " + e)
        }
    }

    static async findScoreById(id) {
        try {
            const pipeline = []
            pipeline.push(
                { $match: { _id: new ObjectId(id) } },
                ...lookupUser(),
                ...project()
            )
            const result = await scoreCollection.aggregate(pipeline).toArray()
            return result[0]
        } catch (e) {
            throw new Error("Error Creating Score: " + e)
        }
    }

    static async findScoreByUser(userId) {
        try {
            return await scoreCollection.findOne(
                { user: new ObjectId(userId) },
                { projection: { user: 0 } }
            )
        } catch (e) {
            throw new Error("Error Getting Score: " + e)
        }
    }

    static async updateScore(id, data) {
        try {
            return await scoreCollection.updateOne(
                { _id: new ObjectId(id) },
                { $set: data }
            )
        } catch (e) {
            throw new Error("Error Updating Score: " + e)
        }
    }

    static async getTopScores(limit) {
        try {
            return await scoreCollection.aggregate([
                { $sort: { point: -1 } },
                { $limit: parseInt(limit) },
                ...lookupUser(),
                ...project()
            ]).toArray()
        } catch (e) {
            throw new Error("Error Top Score: " + e)
        }
    }

    static async updateScoreAfterVictory(userId) {
        try {
            return await scoreCollection.updateOne(
                { user: new ObjectId(userId) },
                { $inc: { point: 10 } }
            )
        } catch (e) {
            throw new Error("Error Top Score: " + e)
        }
    }
} 

const lookupUser = () => ([
    {
        $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "user"
        }
    },
    {
        $unwind: {
            path: "$user",
            preserveNullAndEmptyArrays: true
        }
    }
])

const project = () => ([
    {
        $project: {
            point: 1,
            power: 1,
            "user.name": 1,
            "user._id": 1,
        }
    }
])