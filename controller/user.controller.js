import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import User from "../model/user.model.js"
import usersDAO from "../dao/user.dao.js"
import tokenDAO from "../dao/token.dao.js"
import Token from "../model/token.model.js"
import scoreDAO from "../dao/score.dao.js"
import Score from "../model/score.model.js"


export default class userController {
    static async createUser(req, res) {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)

        try {
            const data = new User({
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword,
            })

            await usersDAO.createUser(data)
            
            res.status(200).json("Create User Successfully")
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    static async signin(req, res) {
        try {
            const { email, password } = req.body
            const existingUser = await usersDAO.signIn(email)
            
            if (!existingUser)
                return res.status(400).json({
                    message: "Invalid Email",
                })
            
            const isPasswordCorrect = await bcrypt.compare(password, existingUser.password)
            if (!isPasswordCorrect)
                return res.status(400).json({
                    message: "Invalid Password",
                })

            const payload = {
                id: existingUser._id,
                email: existingUser.email,
            }

            const token = jwt.sign(payload, process.env.SECRET, {
                expiresIn: "6h",
            })

            const newRefreshToken = new Token({
                user: existingUser._id,
                token: token
            })
            await tokenDAO.createToken(newRefreshToken)

            const score = new Score({
                user: existingUser._id
            })

            await scoreDAO.createScore(score)

            res.status(200).json({
                token,
                user: {
                    _id: existingUser._id,
                    name: existingUser.name,
                    email: existingUser.email,
                }
            })
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    static async logout(req, res) {
        const token = req.headers.authorization?.split(" ")[1] ?? null
        try {
            if (token)
                await tokenDAO.deleteTokenByAccess(token)
            res.status(200).json({ message: "Logout successful" })
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    static async getProfileUser(req, res) {
        try {
            const userId = req.userId
            console.log("userId: ", userId);
            
            const user = await usersDAO.getUserById(userId)

            if (!user)
                return res.status(404).json({ message: "User not found" })

            const score = await scoreDAO.findScoreByUser(userId)

            const responseData = {
                _id: user._id,
                name: user.name,
                email: user.email,
                score: score
            }

            res.status(200).json(responseData)
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

}