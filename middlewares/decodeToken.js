import jwt from 'jsonwebtoken'

export const decodeToken = (req, res, next) => {
    const authHeader = req.headers.authorization
    const token = authHeader.split(" ")[1]
    try {
        const decoded = jwt.verify(token, process.env.SECRET)
        req.userId = decoded.id
        next()
    } catch (e) {
        res.status(401).json({ error: e.message })
    }
}