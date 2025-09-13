import scoreDAO from "../dao/score.dao.js"


export default class scoreController {
    static async getScore(req, res) {
        try {
            const userId = req.userId
            console.log("userId: ", userId);

            const score = await scoreDAO.findScoreByUser(userId)

            console.log("score: ", score);
            

            res.status(200).json(score)
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    static async updateScore(req, res) {
        try {
            const scoreId = req.params.id
            const { point, power } = req.body

            const data = {
                point: point,
                power: power
            }

            await scoreDAO.updateScore(scoreId, data)

            const score = await scoreDAO.findScoreById(scoreId)

            res.status(200).json(score)
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }
    
    static async getRank(req, res) {
        try {
            const { limit } = req.query
            
            const topScores = await scoreDAO.getTopScores(limit)
            res.status(200).json(topScores)
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }
}