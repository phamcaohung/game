export default class User {
    constructor({ name, email, password, equip, inventories = [] }) {
        this.name = name,
        this.email = email,
        this.password = password,
        this.equip = equip,
        this.inventories = inventories
    }
}