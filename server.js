import express from 'express'
import cors from 'cors'
import passport from 'passport'
import userRouters from "./routes/user.routes.js"
import scoreRouters from "./routes/score.routes.js"
import itemRouters from "./routes/item.routes.js"
import inventoryRouters from "./routes/inventory.routes.js"
import equipmentRouters from "./routes/equipment.routes.js"
import swaggerDocs from './swagger.js'

const app = express()
app.use(cors(['localhost:8081']))
app.use(express.json())
app.use(passport.initialize())
swaggerDocs(app, process.env.PORT || 5000)
app.get('/', (req, res) => {
  res.send('<h1>Backend here!</h1>')
})

app.use("/api/v1/users", userRouters)
app.use("/api/v1/scores", scoreRouters)
app.use("/api/v1/items", itemRouters)
app.use("/api/v1/inventory", inventoryRouters)
app.use("/api/v1/equipment", equipmentRouters)

export default app
