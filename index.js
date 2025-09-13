import app from './server.js'
import mongodb from "mongodb"
import dotenv from "dotenv"
import usersDAO from './dao/user.dao.js'
import tokenDAO from './dao/token.dao.js'
import scoreDAO from './dao/score.dao.js'
import inventoryDAO from './dao/inventory.dao.js'
import equipmentDAO from './dao/equipment.dao.js'
import itemDAO from './dao/item.dao.js'

async function main() {
  dotenv.config()

  const client = new mongodb.MongoClient(process.env.DATABASE)
  const port = process.env.PORT || 5000
  const hostName = process.env.HOST_NAME
  try {
    await client.connect()
    await usersDAO.injectDB(client)
    await tokenDAO.injectDB(client)
    await scoreDAO.injectDB(client)
    await inventoryDAO.injectDB(client)
    await equipmentDAO.injectDB(client)
    await itemDAO.injectDB(client)
    app.listen(port, () => {
      console.log(`Server is running on port ${hostName}:${port}`)
    })
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}
main().catch(console.error) 